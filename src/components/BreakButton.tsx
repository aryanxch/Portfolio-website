import { AlertOctagon } from "lucide-react";
import { useEffect, useState } from "react";

const TOTAL_MS = 3500;
const SHARD_COUNT = 90;

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
      delay: Math.random() * 200,
    };
  });

const BreakButton = () => {
  const [breaking, setBreaking] = useState(false);
  const [shards, setShards] = useState<Shard[]>([]);

  useEffect(() => {
    if (!breaking) return;

    setShards(buildShards());

    const sidebarChildren = Array.from(
      document.querySelectorAll<HTMLElement>("aside > div > div, nav > button")
    );

    const originals = new Map<HTMLElement, string>();

    const tumble = (els: HTMLElement[], heavy: boolean) => {
      els.forEach((el) => {
        originals.set(el, el.style.cssText);
        const dx = (Math.random() - 0.5) * (heavy ? 500 : 120);
        const dy = heavy
          ? 200 + Math.random() * 600
          : (Math.random() - 0.5) * 200;
        const rot = (Math.random() - 0.5) * (heavy ? 45 : 15);
        const delay = Math.random() * 250;
        el.style.transition = `transform 1.4s cubic-bezier(0.45, 0.05, 0.65, 0.4) ${delay}ms, opacity 1.4s ease-out ${delay}ms`;
        el.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
        el.style.opacity = "0";
      });
    };

    tumble(Array.from(document.querySelectorAll<HTMLElement>("section")), true);
    tumble(sidebarChildren, false);

    const resetTimer = window.setTimeout(() => {
      originals.forEach((cssText, el) => {
        el.style.cssText = cssText;
      });
      setBreaking(false);
      setShards([]);
    }, TOTAL_MS);

    return () => {
      window.clearTimeout(resetTimer);
      originals.forEach((cssText, el) => {
        el.style.cssText = cssText;
      });
    };
  }, [breaking]);

  return (
    <>
      <button
        onClick={() => setBreaking(true)}
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
          <div className="break-flash" />
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
