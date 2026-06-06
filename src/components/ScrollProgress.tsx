import { useEffect, useState } from "react";

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1.5 z-50 pointer-events-none bg-border/40">
      <div
        className="h-full origin-left"
        style={{
          width: `${progress}%`,
          background: "#22c55e",
          boxShadow: "0 0 8px rgba(34, 197, 94, 0.6)",
          transition: "width 80ms linear",
        }}
      />
    </div>
  );
};

export default ScrollProgress;
