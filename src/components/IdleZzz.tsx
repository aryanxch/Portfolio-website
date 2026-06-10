import { useEffect, useRef, useState } from "react";

const IDLE_MS = 45000;

const IdleZzz = () => {
  const [asleep, setAsleep] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const reset = () => {
      setAsleep(false);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setAsleep(true), IDLE_MS);
    };

    const events = ["mousemove", "keydown", "scroll", "touchstart", "click"] as const;
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();

    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  if (!asleep) return null;

  return (
    <div className="fixed top-6 right-6 z-50 pointer-events-none select-none" aria-hidden>
      <div className="relative font-serif italic text-accent">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="zzz absolute right-0"
            style={{
              fontSize: `${14 + i * 6}px`,
              animationDelay: `${i * 700}ms`,
              right: `${i * 10}px`,
            }}
          >
            z
          </span>
        ))}
        <span className="text-xs text-muted-foreground not-italic font-mono mr-8">
          site fell asleep
        </span>
      </div>
    </div>
  );
};

export default IdleZzz;
