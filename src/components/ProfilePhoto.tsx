import { useEffect, useRef, useState } from "react";
import profilePhoto from "@/assets/profile-photo.jpg";
import { shoot, crash } from "@/lib/sfx";

const SHOTS_TO_BREAK = 5;
const DRAG_THRESHOLD = 6;
const PIECE_COLS = 5;
const PIECE_ROWS = 4;
const CRACK_DRAW_MS = 700;
const FALL_MS = 1500;
const RESET_AFTER_MS = 2300;

interface Hole {
  id: number;
  xPct: number;
  yPct: number;
  rot: number;
  size: number;
}

// crack coordinates live in the photo's 0–100 viewBox space
interface CrackPath {
  id: string;
  d: string;
  length: number;
  delay: number;
  duration: number;
}

interface Piece {
  row: number;
  col: number;
  drift: number;
  rot: number;
  delay: number;
  duration: number;
}

const buildCracks = (xPct: number, yPct: number, idBase: number): CrackPath[] => {
  const rayCount = 4 + Math.floor(Math.random() * 3);
  const out: CrackPath[] = [];
  for (let r = 0; r < rayCount; r++) {
    const baseAngle = (Math.PI * 2 * r) / rayCount + (Math.random() - 0.5) * 0.7;
    const segments = 4 + Math.floor(Math.random() * 3);
    const totalLen = 9 + Math.random() * 12;
    let x = xPct;
    let y = yPct;
    let angle = baseAngle;
    let d = `M${x.toFixed(1)} ${y.toFixed(1)}`;
    let length = 0;
    for (let s = 0; s < segments; s++) {
      angle += (Math.random() - 0.5) * 0.8;
      const segLen = (totalLen / segments) * (0.6 + Math.random() * 0.8);
      const nx = x + Math.cos(angle) * segLen;
      const ny = y + Math.sin(angle) * segLen;
      d += ` L${nx.toFixed(1)} ${ny.toFixed(1)}`;
      length += Math.hypot(nx - x, ny - y);
      x = nx;
      y = ny;
    }
    out.push({
      id: `${idBase}-${r}`,
      d,
      length,
      delay: Math.random() * 150,
      duration: CRACK_DRAW_MS * (0.7 + Math.random() * 0.6),
    });
  }
  return out;
};

const buildPieces = (): Piece[] => {
  const pieces: Piece[] = [];
  for (let row = 0; row < PIECE_ROWS; row++) {
    for (let col = 0; col < PIECE_COLS; col++) {
      pieces.push({
        row,
        col,
        drift: (Math.random() - 0.5) * 120,
        rot: (Math.random() - 0.5) * 240,
        delay: Math.random() * 200,
        duration: FALL_MS * (0.8 + Math.random() * 0.4),
      });
    }
  }
  return pieces;
};

const HOLE_CRACKS = ["M10 10 L3 4", "M10 10 L17 5", "M10 10 L4 16", "M10 10 L16 15", "M10 10 L10 2"];

// transition-driven (var() in keyframe transforms doesn't animate reliably)
const FallingPiece = ({ piece }: { piece: Piece }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // force a reflow so the initial position is committed, then transition to fallen
    el.getBoundingClientRect();
    el.style.transition = `transform ${piece.duration}ms cubic-bezier(0.45, 0.05, 0.8, 0.5) ${piece.delay}ms, opacity ${Math.round(piece.duration * 0.3)}ms ease-in ${piece.delay + Math.round(piece.duration * 0.7)}ms`;
    el.style.transform = `translate(${piece.drift}px, 110vh) rotate(${piece.rot}deg)`;
    el.style.opacity = "0";
  }, [piece]);

  return (
    <div
      ref={ref}
      className="photo-piece"
      style={{
        left: `${(piece.col / PIECE_COLS) * 100}%`,
        top: `${(piece.row / PIECE_ROWS) * 100}%`,
        width: `${100 / PIECE_COLS}%`,
        height: `${100 / PIECE_ROWS}%`,
        backgroundImage: `url(${profilePhoto})`,
        backgroundSize: `${PIECE_COLS * 100}% ${PIECE_ROWS * 100}%`,
        backgroundPosition: `${(piece.col / (PIECE_COLS - 1)) * 100}% ${(piece.row / (PIECE_ROWS - 1)) * 100}%`,
      }}
    />
  );
};

const BulletHole = ({ hole }: { hole: Hole }) => (
  <svg
    width={hole.size}
    height={hole.size}
    viewBox="0 0 20 20"
    className="bullet-hole absolute pointer-events-none"
    style={{
      left: `${hole.xPct}%`,
      top: `${hole.yPct}%`,
      transform: `translate(-50%, -50%) rotate(${hole.rot}deg)`,
    }}
  >
    {HOLE_CRACKS.map((d, i) => (
      <path key={i} d={d} stroke="rgba(10,10,10,0.8)" strokeWidth="0.8" fill="none" />
    ))}
    <circle cx="10" cy="10" r="4.2" fill="none" stroke="rgba(10,10,10,0.45)" strokeWidth="1.4" />
    <circle cx="10" cy="10" r="2.6" fill="#0a0a0a" />
  </svg>
);

const ProfilePhoto = () => {
  const [recoiling, setRecoiling] = useState(false);
  const [respawning, setRespawning] = useState(false);
  const [holes, setHoles] = useState<Hole[]>([]);
  const [cracks, setCracks] = useState<CrackPath[]>([]);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const broken = pieces.length > 0;
  const brokenRef = useRef(false);
  brokenRef.current = broken;
  const shotsRef = useRef(0);
  const idRef = useRef(0);
  const timersRef = useRef<number[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const drag = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    dx: 0,
    dy: 0,
    vx: 0,
    vy: 0,
    lastX: 0,
    lastY: 0,
    lastT: 0,
    raf: 0,
  });

  useEffect(() => {
    const d = drag.current;
    const timers = timersRef.current;
    return () => {
      cancelAnimationFrame(d.raf);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const later = (fn: () => void, ms: number) =>
    timersRef.current.push(window.setTimeout(fn, ms));

  const applyDragTransform = () => {
    const d = drag.current;
    if (wrapRef.current) {
      wrapRef.current.style.transform = `translate(${d.dx}px, ${d.dy}px) rotate(${d.dx * 0.03}deg)`;
    }
  };

  // spring back home after a fling
  const springBack = () => {
    const d = drag.current;
    const step = () => {
      const ax = -0.12 * d.dx - 0.16 * d.vx;
      const ay = -0.12 * d.dy - 0.16 * d.vy;
      d.vx += ax;
      d.vy += ay;
      d.dx += d.vx;
      d.dy += d.vy;
      if (Math.abs(d.dx) < 0.5 && Math.abs(d.dy) < 0.5 && Math.abs(d.vx) < 0.5 && Math.abs(d.vy) < 0.5) {
        d.dx = 0;
        d.dy = 0;
        d.vx = 0;
        d.vy = 0;
        if (wrapRef.current) wrapRef.current.style.transform = "";
        return;
      }
      applyDragTransform();
      d.raf = requestAnimationFrame(step);
    };
    d.raf = requestAnimationFrame(step);
  };

  const breakApart = () => {
    crash();
    setPieces(buildPieces());
    later(() => {
      setPieces([]);
      setHoles([]);
      setCracks([]);
      shotsRef.current = 0;
      setRespawning(true);
      later(() => setRespawning(false), 500);
    }, RESET_AFTER_MS);
  };

  const fireShot = (clientX: number, clientY: number) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;

    shoot();
    const id = idRef.current++;
    const xPct = ((clientX - rect.left) / rect.width) * 100;
    const yPct = ((clientY - rect.top) / rect.height) * 100;
    setHoles((h) => [
      ...h,
      { id, xPct, yPct, rot: Math.random() * 360, size: 16 + Math.random() * 10 },
    ]);
    setCracks((c) => [...c, ...buildCracks(xPct, yPct, id)]);

    setRecoiling(true);
    later(() => setRecoiling(false), 280);

    shotsRef.current += 1;
    if (shotsRef.current >= SHOTS_TO_BREAK) {
      // let the cracks finish spreading before it gives way
      later(breakApart, CRACK_DRAW_MS + 150);
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (brokenRef.current) return;
    const d = drag.current;
    cancelAnimationFrame(d.raf);
    d.active = true;
    d.moved = false;
    d.startX = e.clientX - d.dx;
    d.startY = e.clientY - d.dy;
    d.lastX = e.clientX;
    d.lastY = e.clientY;
    d.lastT = performance.now();
    d.vx = 0;
    d.vy = 0;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.active) return;
    d.dx = e.clientX - d.startX;
    d.dy = e.clientY - d.startY;
    if (!d.moved && Math.hypot(d.dx, d.dy) > DRAG_THRESHOLD) d.moved = true;

    const now = performance.now();
    const dt = Math.max(1, now - d.lastT);
    d.vx = ((e.clientX - d.lastX) / dt) * 16;
    d.vy = ((e.clientY - d.lastY) / dt) * 16;
    d.lastX = e.clientX;
    d.lastY = e.clientY;
    d.lastT = now;

    if (d.moved) applyDragTransform();
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    if (d.moved) {
      springBack();
    } else if (!brokenRef.current) {
      fireShot(e.clientX, e.clientY);
    }
  };

  // subtle 3D tilt toward cursor when idle (desktop only)
  const onMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (recoiling || brokenRef.current || drag.current.active) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = imgRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(700px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 7).toFixed(2)}deg) scale(1.015)`;
  };

  const onMouseLeave = () => {
    if (imgRef.current && !drag.current.active) imgRef.current.style.transform = "";
  };

  return (
    <div
      ref={wrapRef}
      className="relative w-full max-w-md select-none touch-none"
      style={{ willChange: "transform" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      title="take the shot. or drag me around."
    >
      <img
        ref={imgRef}
        src={profilePhoto}
        alt="Aryan Choudhari"
        draggable={false}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className={`w-full rounded-lg shadow-lg ${recoiling ? "photo-recoil" : ""} ${
          respawning ? "photo-respawn" : ""
        }`}
        style={{
          transition: "transform 150ms ease-out",
          willChange: "transform",
          visibility: broken ? "hidden" : "visible",
        }}
      />

      {/* glass cracks, drawn slowly around each impact */}
      {!broken && cracks.length > 0 && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ filter: "drop-shadow(0 0 1px rgba(0,0,0,0.5))" }}
        >
          {cracks.map((c) => (
            <path
              key={c.id}
              d={c.d}
              fill="none"
              stroke="rgba(15,15,15,0.7)"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              style={{
                strokeDasharray: c.length,
                strokeDashoffset: c.length,
                animation: `crack-draw ${c.duration}ms cubic-bezier(0.22, 1, 0.36, 1) forwards`,
                animationDelay: `${c.delay}ms`,
              }}
            />
          ))}
        </svg>
      )}

      {!broken && holes.map((h) => <BulletHole key={h.id} hole={h} />)}

      {/* the photo breaks into pieces that fall down the page */}
      {pieces.map((p) => (
        <FallingPiece key={`${p.row}-${p.col}`} piece={p} />
      ))}
    </div>
  );
};

export default ProfilePhoto;
