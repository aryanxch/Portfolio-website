import { AlertOctagon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const TOTAL_MS = 4000;
const SHARD_COUNT = 90;
const CRACK_DRAW_MS = 550;
const TUMBLE_DELAY_MS = 480;

interface Shard {
  id: number;
  startX: number;
  startY: number;
  dx: number;
  dy: number;
  rot: number;
  size: number;
  delay: number;
}

interface Crack {
  d: string;
  length: number;
  duration: number;
  delay: number;
  width: number;
}

const buildShards = (): Shard[] =>
  Array.from({ length: SHARD_COUNT }).map((_, i) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    return {
      id: i,
      startX: Math.random() * w,
      startY: Math.random() * h,
      dx: (Math.random() - 0.5) * 1600,
      dy: -300 + Math.random() * 1500,
      rot: (Math.random() - 0.5) * 1440,
      size: 5 + Math.random() * 14,
      delay: 300 + Math.random() * 250,
    };
  });

interface CrackBuild {
  d: string;
  length: number;
  points: { x: number; y: number }[];
}

const buildCrackPath = (
  cx: number,
  cy: number,
  baseAngle: number,
  totalLength: number,
  jitter = 0.55
): CrackBuild => {
  const segments = 7 + Math.floor(Math.random() * 6);
  const points: { x: number; y: number }[] = [{ x: cx, y: cy }];
  let x = cx;
  let y = cy;
  let angle = baseAngle;
  for (let i = 0; i < segments; i++) {
    angle += (Math.random() - 0.5) * jitter;
    const segLen = (totalLength / segments) * (0.55 + Math.random() * 0.9);
    x += Math.cos(angle) * segLen;
    y += Math.sin(angle) * segLen;
    points.push({ x, y });
  }
  let d = `M${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  let length = 0;
  for (let i = 1; i < points.length; i++) {
    d += ` L${points[i].x.toFixed(1)} ${points[i].y.toFixed(1)}`;
    length += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
  }
  return { d, length, points };
};

const buildCracks = (origin: { x: number; y: number }): Crack[] => {
  const mainCount = 9;
  const out: Crack[] = [];
  const maxReach = Math.hypot(window.innerWidth, window.innerHeight);
  for (let i = 0; i < mainCount; i++) {
    const angle = (Math.PI * 2 * i) / mainCount + (Math.random() - 0.5) * 0.4;
    const main = buildCrackPath(origin.x, origin.y, angle, maxReach * 0.9);
    out.push({
      d: main.d,
      length: main.length,
      duration: 350 + Math.random() * 200,
      delay: Math.random() * 80,
      width: 1.4 + Math.random() * 0.8,
    });
    const branchCount = 1 + Math.floor(Math.random() * 3);
    for (let j = 0; j < branchCount; j++) {
      const waypointIdx = 2 + Math.floor(Math.random() * Math.max(1, main.points.length - 3));
      const p = main.points[waypointIdx];
      if (!p) continue;
      const branchAngle = angle + (Math.random() - 0.5) * 1.8;
      const branch = buildCrackPath(p.x, p.y, branchAngle, 220 + Math.random() * 320, 0.7);
      out.push({
        d: branch.d,
        length: branch.length,
        duration: 280 + Math.random() * 180,
        delay: 120 + Math.random() * 200,
        width: 0.8 + Math.random() * 0.6,
      });
    }
  }
  return out;
};

const BreakButton = () => {
  const [breaking, setBreaking] = useState(false);
  const [shards, setShards] = useState<Shard[]>([]);
  const [cracks, setCracks] = useState<Crack[]>([]);
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    if (breaking) return;
    const rect = btnRef.current?.getBoundingClientRect();
    const origin = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    setCracks(buildCracks(origin));
    setShards(buildShards());
    setBreaking(true);
  };

  // the terminal's `rm -rf /` triggers the same shatter
  useEffect(() => {
    const onBreak = () => handleClick();
    window.addEventListener("aryan:break", onBreak);
    return () => window.removeEventListener("aryan:break", onBreak);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breaking]);

  useEffect(() => {
    if (!breaking) return;

    const sidebarChildren = Array.from(
      document.querySelectorAll<HTMLElement>("aside > div > div, nav > button")
    );
    const originals = new Map<HTMLElement, string>();

    const tumble = (els: HTMLElement[], heavy: boolean) => {
      els.forEach((el) => {
        originals.set(el, el.style.cssText);
        const dx = (Math.random() - 0.5) * (heavy ? 500 : 120);
        const dy = heavy ? 200 + Math.random() * 600 : (Math.random() - 0.5) * 200;
        const rot = (Math.random() - 0.5) * (heavy ? 45 : 15);
        const delay = Math.random() * 250;
        el.style.transition = `transform 1.4s cubic-bezier(0.45, 0.05, 0.65, 0.4) ${delay}ms, opacity 1.4s ease-out ${delay}ms`;
        el.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
        el.style.opacity = "0";
      });
    };

    const tumbleTimer = window.setTimeout(() => {
      tumble(Array.from(document.querySelectorAll<HTMLElement>("section")), true);
      tumble(sidebarChildren, false);
    }, TUMBLE_DELAY_MS);

    const resetTimer = window.setTimeout(() => {
      originals.forEach((cssText, el) => {
        el.style.cssText = cssText;
      });
      setBreaking(false);
      setShards([]);
      setCracks([]);
    }, TOTAL_MS);

    return () => {
      window.clearTimeout(tumbleTimer);
      window.clearTimeout(resetTimer);
      originals.forEach((cssText, el) => {
        el.style.cssText = cssText;
      });
    };
  }, [breaking]);

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleClick}
        disabled={breaking}
        aria-label="do not click"
        className="w-full flex items-center justify-center gap-2 border border-red-500/60 text-red-500 px-3 py-2 text-xs uppercase tracking-widest hover:bg-red-500/10 transition-colors disabled:opacity-50"
        style={{ animation: breaking ? "none" : "break-pulse 2.4s ease-in-out infinite" }}
      >
        <AlertOctagon className="w-3.5 h-3.5" />
        do not click
      </button>

      {breaking && (
        <>
          {/* Crack overlay */}
          <svg
            className="fixed inset-0 pointer-events-none"
            width="100%"
            height="100%"
            style={{
              zIndex: 85,
              filter: "drop-shadow(0 0 1px rgba(0,0,0,0.6))",
            }}
          >
            {cracks.map((c, i) => (
              <path
                key={i}
                d={c.d}
                fill="none"
                stroke="currentColor"
                strokeWidth={c.width}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  color: "#111",
                  strokeDasharray: c.length,
                  strokeDashoffset: c.length,
                  animation: `crack-draw ${c.duration}ms cubic-bezier(0.22, 1, 0.36, 1) forwards`,
                  animationDelay: `${c.delay}ms`,
                }}
              />
            ))}
            {/* lighter highlight under cracks for glass split feel */}
            {cracks.map((c, i) => (
              <path
                key={`hl-${i}`}
                d={c.d}
                fill="none"
                stroke="white"
                strokeWidth={Math.max(0.4, c.width - 0.6)}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: "translate(1px, 1px)",
                  opacity: 0.55,
                  strokeDasharray: c.length,
                  strokeDashoffset: c.length,
                  animation: `crack-draw ${c.duration}ms cubic-bezier(0.22, 1, 0.36, 1) forwards`,
                  animationDelay: `${c.delay + 30}ms`,
                }}
              />
            ))}
          </svg>

          <div className="break-flash" style={{ animationDelay: `${CRACK_DRAW_MS - 100}ms` }} />

          {shards.map((s) => (
            <span
              key={s.id}
              className="break-shard"
              style={
                {
                  position: "fixed",
                  left: s.startX,
                  top: s.startY,
                  width: s.size,
                  height: s.size,
                  background: "#22c55e",
                  boxShadow:
                    "0 0 10px rgba(34,197,94,0.9), 0 0 20px rgba(34,197,94,0.4)",
                  zIndex: 90,
                  pointerEvents: "none",
                  "--dx": `${s.dx}px`,
                  "--dy": `${s.dy}px`,
                  "--rot": `${s.rot}deg`,
                  animationDelay: `${s.delay}ms`,
                } as React.CSSProperties
              }
            />
          ))}

          <div className="break-message">
            <pre className="text-center">
              SYSTEM FAULT
              <br />
              <span className="text-xs opacity-70">restoring...</span>
            </pre>
          </div>
        </>
      )}
    </>
  );
};

export default BreakButton;
