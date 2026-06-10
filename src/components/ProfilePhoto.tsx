import { useEffect, useRef, useState } from "react";
import profilePhoto from "@/assets/profile-photo.jpg";
import { shoot } from "@/lib/sfx";

const SPIN_EVERY = 5;
const DRAG_THRESHOLD = 6;

interface Hole {
  id: number;
  xPct: number;
  yPct: number;
  rot: number;
  size: number;
}

interface Burst {
  id: number;
  x: number;
  y: number;
  shards: { dx: number; dy: number; rot: number; size: number; delay: number }[];
}

const buildBurst = (id: number, x: number, y: number): Burst => ({
  id,
  x,
  y,
  shards: Array.from({ length: 8 }).map((_, i) => {
    const angle = (Math.PI * 2 * i) / 8 + (Math.random() - 0.5) * 0.5;
    const dist = 80 + Math.random() * 160;
    return {
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist,
      rot: (Math.random() - 0.5) * 540,
      size: 3 + Math.random() * 5,
      delay: Math.random() * 40,
    };
  }),
});

const HOLE_CRACKS = ["M10 10 L3 4", "M10 10 L17 5", "M10 10 L4 16", "M10 10 L16 15", "M10 10 L10 2"];

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
  const [anim, setAnim] = useState<"none" | "recoil" | "spin">("none");
  const [holes, setHoles] = useState<Hole[]>([]);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const shotsRef = useRef(0);
  const idRef = useRef(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const animRef = useRef(anim);
  animRef.current = anim;
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
    return () => cancelAnimationFrame(d.raf);
  }, []);

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

  const fireShot = (clientX: number, clientY: number) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;

    shoot();
    const id = idRef.current++;
    setHoles((h) => [
      ...h,
      {
        id,
        xPct: ((clientX - rect.left) / rect.width) * 100,
        yPct: ((clientY - rect.top) / rect.height) * 100,
        rot: Math.random() * 360,
        size: 16 + Math.random() * 10,
      },
    ]);
    const burst = buildBurst(id, clientX, clientY);
    setBursts((b) => [...b, burst]);
    window.setTimeout(() => setBursts((b) => b.filter((x) => x.id !== burst.id)), 1300);

    shotsRef.current += 1;
    if (shotsRef.current % SPIN_EVERY === 0) {
      setAnim("spin");
      window.setTimeout(() => {
        setAnim("none");
        setHoles([]); // fresh photo, who dis
      }, 1000);
    } else {
      setAnim("recoil");
      window.setTimeout(() => setAnim((a) => (a === "recoil" ? "none" : a)), 280);
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (animRef.current === "spin") return;
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
    } else {
      fireShot(e.clientX, e.clientY);
    }
  };

  // subtle 3D tilt toward cursor when idle (desktop only)
  const onMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (animRef.current !== "none" || drag.current.active) return;
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
    <>
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
          className={`w-full rounded-lg shadow-lg ${
            anim === "recoil" ? "photo-recoil" : anim === "spin" ? "photo-spin" : ""
          }`}
          style={{ transition: "transform 150ms ease-out", willChange: "transform" }}
        />
        {anim !== "spin" && holes.map((h) => <BulletHole key={h.id} hole={h} />)}
      </div>

      {bursts.map((b) =>
        b.shards.map((s, i) => (
          <span
            key={`${b.id}-${i}`}
            className="hidden-shard"
            style={
              {
                position: "fixed",
                left: b.x,
                top: b.y,
                width: s.size,
                height: s.size,
                background: "#22c55e",
                boxShadow: "0 0 10px rgba(34,197,94,0.85), 0 0 18px rgba(34,197,94,0.45)",
                pointerEvents: "none",
                zIndex: 60,
                "--dx": `${s.dx}px`,
                "--dy": `${s.dy}px`,
                "--rot": `${s.rot}deg`,
                animationDelay: `${s.delay}ms`,
              } as React.CSSProperties
            }
          />
        ))
      )}
    </>
  );
};

export default ProfilePhoto;
