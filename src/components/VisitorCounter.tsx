import { useEffect, useState } from "react";

const STORAGE_KEY = "aryan-visitor-number";
const BASE = 4038;
const LAUNCH = new Date("2026-06-01").getTime();

const VisitorCounter = () => {
  const [num, setNum] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && !Number.isNaN(parseInt(stored, 10))) {
      setNum(parseInt(stored, 10));
      return;
    }
    const days = Math.max(0, Math.floor((Date.now() - LAUNCH) / 86_400_000));
    const n = BASE + days * 7 + Math.floor(Math.random() * 6);
    localStorage.setItem(STORAGE_KEY, String(n));
    setNum(n);
  }, []);

  if (num === null) return null;

  return (
    <p className="text-[10px] text-muted-foreground font-mono">
      you are visitor #{num.toLocaleString()}{" "}
      <span className="italic">(probably)</span>
    </p>
  );
};

export default VisitorCounter;
