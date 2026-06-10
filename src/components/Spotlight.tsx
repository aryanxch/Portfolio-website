import { useEffect, useRef } from "react";

const SIZE = 600;

/** Subtle green glow that follows the cursor, sitting above the background. */
const Spotlight = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const onMove = (e: MouseEvent) => {
      if (ref.current) {
        ref.current.style.transform = `translate3d(${e.clientX - SIZE / 2}px, ${e.clientY - SIZE / 2}px, 0)`;
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden" aria-hidden>
      <div
        ref={ref}
        style={{
          width: SIZE,
          height: SIZE,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, hsl(var(--accent) / 0.06) 0%, transparent 60%)",
          willChange: "transform",
          transform: "translate3d(-1000px, -1000px, 0)",
        }}
      />
    </div>
  );
};

export default Spotlight;
