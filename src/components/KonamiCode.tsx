import { useEffect, useRef, useState } from "react";

const SEQUENCE = [
  "arrowup",
  "arrowup",
  "arrowdown",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "arrowleft",
  "arrowright",
  "b",
  "a",
];

const KonamiCode = () => {
  const [crt, setCrt] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const idxRef = useRef(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target;
      if (
        target instanceof HTMLElement &&
        target.closest("input, textarea, [contenteditable='true']")
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      if (key === SEQUENCE[idxRef.current]) {
        idxRef.current += 1;
        if (idxRef.current === SEQUENCE.length) {
          idxRef.current = 0;
          setCrt((prev) => {
            const next = !prev;
            setFlash(next ? "CRT MODE: ON" : "CRT MODE: OFF");
            window.setTimeout(() => setFlash(null), 2000);
            return next;
          });
        }
      } else {
        idxRef.current = key === SEQUENCE[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {crt && (
        <>
          <div className="crt-scanlines" aria-hidden />
          <div className="crt-tint" aria-hidden />
        </>
      )}
      {flash && (
        <div className="crt-flash-message font-mono" aria-hidden>
          {flash}
        </div>
      )}
    </>
  );
};

export default KonamiCode;
