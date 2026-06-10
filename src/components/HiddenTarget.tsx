import { useRef, useState } from "react";
import { shoot, crash } from "@/lib/sfx";

const HITS_TO_BREAK = 5;

const CRACK_PATHS = [
  "M22 22 L6 4",
  "M22 22 L40 6",
  "M22 22 L4 40",
  "M22 22 L42 38",
  "M22 22 L22 1",
];

interface Shard {
  id: number;
  dx: number;
  dy: number;
  rot: number;
  size: number;
  delay: number;
}

const buildShards = (count: number): Shard[] => {
  return Array.from({ length: count }).map((_, i) => {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
    const dist = 350 + Math.random() * 700;
    return {
      id: i,
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist,
      rot: (Math.random() - 0.5) * 1080,
      size: 4 + Math.random() * 8,
      delay: Math.random() * 60,
    };
  });
};

interface HiddenTargetProps {
  size?: number;
  shardCount?: number;
  wrapperClassName?: string;
}

const HiddenTarget = ({
  size = 52,
  shardCount = 28,
  wrapperClassName = "py-12 flex justify-center",
}: HiddenTargetProps) => {
  const [hits, setHits] = useState(0);
  const [shards, setShards] = useState<Shard[]>([]);
  const [shatterOrigin, setShatterOrigin] = useState<{ x: number; y: number } | null>(null);
  const [gone, setGone] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (gone || shatterOrigin) return;

    const next = hits + 1;
    if (next >= HITS_TO_BREAK) {
      crash();
      const rect = btnRef.current?.getBoundingClientRect();
      if (rect) {
        setShatterOrigin({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }
      setShards(buildShards(shardCount));
      window.setTimeout(() => setGone(true), 1400);
    } else {
      shoot();
    }
    setHits(next);
  };

  if (gone) return null;

  return (
    <div className={wrapperClassName}>
      {!shatterOrigin && (
        <button
          ref={btnRef}
          onClick={handleClick}
          aria-label="???"
          className="relative inline-flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-150 text-accent"
          style={{
            background: "transparent",
            border: "none",
            padding: 0,
            filter: "drop-shadow(0 0 4px rgba(34,197,94,0.4))",
          }}
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 44 44"
            className={hits >= HITS_TO_BREAK - 1 ? "hidden-target-shake" : ""}
            style={{ display: "block" }}
          >
            <circle cx="22" cy="22" r="20" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="22" cy="22" r="14" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="22" cy="22" r="7" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="22" cy="22" r="2.5" fill="currentColor" />
            {CRACK_PATHS.slice(0, hits).map((d, i) => (
              <path
                key={i}
                d={d}
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                opacity={0.9}
              />
            ))}
          </svg>
        </button>
      )}

      {shatterOrigin &&
        shards.map((s) => (
          <span
            key={s.id}
            className="hidden-shard"
            style={
              {
                position: "fixed",
                left: shatterOrigin.x,
                top: shatterOrigin.y,
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
        ))}
    </div>
  );
};

export default HiddenTarget;
