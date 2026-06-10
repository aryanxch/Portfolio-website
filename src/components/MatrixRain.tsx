import { useEffect, useRef } from "react";

const CHARS = "アィウェオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF$+-*/=%#&";

interface MatrixRainProps {
  onExit: () => void;
}

const MatrixRain = ({ onExit }: MatrixRainProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 16;
    const columns = Math.ceil(canvas.width / fontSize);
    const drops = Array.from({ length: columns }, () => Math.random() * -40);

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const interval = window.setInterval(() => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.07)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillStyle = Math.random() > 0.97 ? "#d1ffd9" : "#22c55e";
        ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }, 50);

    const stop = (e: Event) => {
      e.stopPropagation();
      onExit();
    };
    window.addEventListener("keydown", stop, true);
    window.addEventListener("pointerdown", stop, true);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("keydown", stop, true);
      window.removeEventListener("pointerdown", stop, true);
    };
  }, [onExit]);

  return (
    <div className="fixed inset-0 z-[70] bg-black">
      <canvas ref={canvasRef} className="block" />
      <div className="absolute bottom-4 left-0 right-0 text-center text-green-600 text-xs font-mono">
        press any key to wake up
      </div>
    </div>
  );
};

export default MatrixRain;
