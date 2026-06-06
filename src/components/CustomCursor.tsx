import { useEffect, useRef, useState } from "react";

const RING_LAG = 0.12;
const INTERACTIVE_SELECTOR = 'a, button, [role="button"], label, summary';
const TEXT_INPUT_SELECTOR = 'input, textarea, [contenteditable="true"]';

const GREEN = "#22c55e";
const RING_SIZE = 34;
const DOT_SIZE = 6;

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: -200, y: -200 });
  const ringPosRef = useRef({ x: -200, y: -200 });
  const rafRef = useRef<number | null>(null);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX - DOT_SIZE / 2}px, ${e.clientY - DOT_SIZE / 2}px, 0)`;
      }

      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.closest(TEXT_INPUT_SELECTOR)) {
        setIsHidden(true);
        return;
      }
      setIsHidden(false);

      const isInt = !!target.closest(INTERACTIVE_SELECTOR);
      setIsInteractive((prev) => (prev !== isInt ? isInt : prev));
    };

    const onLeave = () => setIsHidden(true);
    const onEnter = () => setIsHidden(false);

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    const tick = () => {
      ringPosRef.current.x += (targetRef.current.x - ringPosRef.current.x) * RING_LAG;
      ringPosRef.current.y += (targetRef.current.y - ringPosRef.current.y) * RING_LAG;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPosRef.current.x - RING_SIZE / 2}px, ${ringPosRef.current.y - RING_SIZE / 2}px, 0)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const opacity = isHidden ? 0 : 1;

  return (
    <>
      {/* Reticle frame — lags behind */}
      <div
        ref={ringRef}
        aria-hidden
        className="fixed top-0 left-0 pointer-events-none z-[100]"
        style={{
          opacity,
          transition: "opacity 120ms ease-out",
          willChange: "transform",
        }}
      >
        <svg
          width={RING_SIZE}
          height={RING_SIZE}
          viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
          style={{
            filter: `drop-shadow(0 0 ${isInteractive ? 6 : 3}px rgba(34, 197, 94, ${isInteractive ? 0.85 : 0.55}))`,
            transform: isInteractive ? "scale(1.35) rotate(45deg)" : "scale(1) rotate(0deg)",
            transformOrigin: "center",
            transition: "transform 220ms cubic-bezier(0.22, 1, 0.36, 1), filter 220ms ease-out",
          }}
        >
          <g
            stroke={GREEN}
            strokeWidth="1.5"
            fill="none"
            shapeRendering="crispEdges"
            strokeLinecap="square"
          >
            {/* Corner brackets */}
            <path d={`M1 1 L1 7 M1 1 L7 1`} />
            <path d={`M${RING_SIZE - 1} 1 L${RING_SIZE - 1} 7 M${RING_SIZE - 1} 1 L${RING_SIZE - 7} 1`} />
            <path d={`M1 ${RING_SIZE - 1} L1 ${RING_SIZE - 7} M1 ${RING_SIZE - 1} L7 ${RING_SIZE - 1}`} />
            <path d={`M${RING_SIZE - 1} ${RING_SIZE - 1} L${RING_SIZE - 1} ${RING_SIZE - 7} M${RING_SIZE - 1} ${RING_SIZE - 1} L${RING_SIZE - 7} ${RING_SIZE - 1}`} />
            {/* Crosshair ticks */}
            <line x1={RING_SIZE / 2} y1="3" x2={RING_SIZE / 2} y2="7" />
            <line x1={RING_SIZE / 2} y1={RING_SIZE - 3} x2={RING_SIZE / 2} y2={RING_SIZE - 7} />
            <line x1="3" y1={RING_SIZE / 2} x2="7" y2={RING_SIZE / 2} />
            <line x1={RING_SIZE - 3} y1={RING_SIZE / 2} x2={RING_SIZE - 7} y2={RING_SIZE / 2} />
          </g>
        </svg>
      </div>

      {/* Precise dot — exact mouse position */}
      <div
        ref={dotRef}
        aria-hidden
        className="fixed top-0 left-0 pointer-events-none z-[100]"
        style={{
          opacity,
          transition: "opacity 120ms ease-out",
          willChange: "transform",
        }}
      >
        <div
          style={{
            width: DOT_SIZE,
            height: DOT_SIZE,
            background: GREEN,
            boxShadow: `0 0 6px rgba(34, 197, 94, 0.9), 0 0 12px rgba(34, 197, 94, 0.4)`,
          }}
        />
      </div>
    </>
  );
};

export default CustomCursor;
