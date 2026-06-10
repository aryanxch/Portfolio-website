import { useEffect, useRef, useState } from "react";
import { pop } from "@/lib/sfx";

const COLS = 24;
const ROWS = 12;
const TICK_MS = 110;

interface Cell {
  x: number;
  y: number;
}

interface TerminalSnakeProps {
  onEnd: (score: number) => void;
}

const randomFood = (snake: Cell[]): Cell => {
  while (true) {
    const f = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    if (!snake.some((c) => c.x === f.x && c.y === f.y)) return f;
  }
};

const TerminalSnake = ({ onEnd }: TerminalSnakeProps) => {
  const [, setTick] = useState(0);
  const snakeRef = useRef<Cell[]>([
    { x: 12, y: 6 },
    { x: 11, y: 6 },
    { x: 10, y: 6 },
  ]);
  const dirRef = useRef<Cell>({ x: 1, y: 0 });
  const nextDirRef = useRef<Cell>({ x: 1, y: 0 });
  const foodRef = useRef<Cell>(randomFood(snakeRef.current));
  const scoreRef = useRef(0);
  const endedRef = useRef(false);

  useEffect(() => {
    const finish = () => {
      if (endedRef.current) return;
      endedRef.current = true;
      onEnd(scoreRef.current);
    };

    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Cell> = {
        arrowup: { x: 0, y: -1 },
        w: { x: 0, y: -1 },
        arrowdown: { x: 0, y: 1 },
        s: { x: 0, y: 1 },
        arrowleft: { x: -1, y: 0 },
        a: { x: -1, y: 0 },
        arrowright: { x: 1, y: 0 },
        d: { x: 1, y: 0 },
      };
      const key = e.key.toLowerCase();
      if (key === "escape" || key === "q") {
        e.preventDefault();
        e.stopPropagation();
        finish();
        return;
      }
      const next = map[key];
      if (!next) return;
      e.preventDefault();
      // no reversing into yourself
      if (next.x === -dirRef.current.x && next.y === -dirRef.current.y) return;
      nextDirRef.current = next;
    };

    const interval = window.setInterval(() => {
      dirRef.current = nextDirRef.current;
      const snake = snakeRef.current;
      const head = {
        x: snake[0].x + dirRef.current.x,
        y: snake[0].y + dirRef.current.y,
      };
      const hitWall = head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS;
      const hitSelf = snake.some((c) => c.x === head.x && c.y === head.y);
      if (hitWall || hitSelf) {
        finish();
        return;
      }
      const ate = head.x === foodRef.current.x && head.y === foodRef.current.y;
      snakeRef.current = [head, ...snake.slice(0, ate ? snake.length : snake.length - 1)];
      if (ate) {
        scoreRef.current += 1;
        foodRef.current = randomFood(snakeRef.current);
        pop();
      }
      setTick((t) => t + 1);
    }, TICK_MS);

    window.addEventListener("keydown", onKey, true);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("keydown", onKey, true);
    };
  }, [onEnd]);

  const snake = snakeRef.current;
  const food = foodRef.current;
  const rows: string[] = [];
  rows.push("┌" + "─".repeat(COLS) + "┐");
  for (let y = 0; y < ROWS; y++) {
    let row = "│";
    for (let x = 0; x < COLS; x++) {
      if (snake[0].x === x && snake[0].y === y) row += "▓";
      else if (snake.some((c) => c.x === x && c.y === y)) row += "█";
      else if (food.x === x && food.y === y) row += "◆";
      else row += " ";
    }
    rows.push(row + "│");
  }
  rows.push("└" + "─".repeat(COLS) + "┘");

  return (
    <div className="my-2">
      <pre className="leading-tight">{rows.join("\n")}</pre>
      <div className="text-xs text-green-600 mt-1">
        score: {scoreRef.current} · arrows/wasd to move · q to quit
      </div>
    </div>
  );
};

export default TerminalSnake;
