import { useEffect, useRef, useState } from "react";

interface Marker {
  id: number;
  x: number;
  y: number;
}

const MIN_DISTANCE = 32;
const FADE_MS = 1400;

const CursorTrail = () => {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const lastPosRef = useRef({ x: -1000, y: -1000 });
  const idRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleMove = (e: MouseEvent) => {
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      if (dx * dx + dy * dy < MIN_DISTANCE * MIN_DISTANCE) return;

      lastPosRef.current = { x: e.clientX, y: e.clientY };
      const id = idRef.current++;
      setMarkers((m) => [...m, { id, x: e.clientX, y: e.clientY }]);

      window.setTimeout(() => {
        setMarkers((m) => m.filter((mk) => mk.id !== id));
      }, FADE_MS);
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {markers.map((m) => (
        <span
          key={m.id}
          className="cursor-marker absolute text-accent font-mono text-xs select-none"
          style={{ left: m.x, top: m.y }}
        >
          +
        </span>
      ))}
    </div>
  );
};

export default CursorTrail;
