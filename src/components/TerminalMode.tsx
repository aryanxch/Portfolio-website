import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import TerminalSnake from "./TerminalSnake";
import MatrixRain from "./MatrixRain";

type Line = { type: "input" | "output"; content: string };

const banner = `
  ┌──────────────────────────────────────────┐
  │  aryan.terminal  v2.0                    │
  │  type 'help' to see available commands   │
  └──────────────────────────────────────────┘
`;

const VIM_SCREEN = `~
~
~                VIM - Vi IMproved
~
~        you are now trapped in vim.
~        there is no undo for this decision.
~
"untitled" [New File]                         0,0-1   All`;

const VIM_TAUNTS = [
  "E492: that is not how vim works.",
  "still here? interesting strategy.",
  "the exit exists. you just haven't earned it yet.",
  "(psst: :q!)",
];

const commands: Record<string, string> = {
  help: `available commands:
  whoami        about me
  experience    work history
  projects      what i've built
  education     where i study
  skills        what i know
  contact       how to reach me
  ls            list sections
  cd            change directory (good luck)
  date          current date and time
  echo          echo back what you type
  snake         waste time productively
  matrix        follow the white rabbit
  vim           open the editor (warning: vim)
  rm -rf /      absolutely do not run this
  sudo          escalate privileges (try it)
  clear         clear the terminal
  exit          close terminal mode  (or press ESC)`,

  whoami: `aryan choudhari
isye major @ georgia tech — econ & financial systems concentration
currently learning the family manufacturing business from the ground up.
long-term: grow into and help carry that business forward.`,

  experience: `research analyst       georgia tech vc club             aug 2025 – present
investments intern     venture catalysts limited        may 2025 – aug 2025
operations intern      sb plastech (fibc manufacturer)  may 2024 – aug 2024
supply chain intern    tube investments of india        may 2023 – aug 2023`,

  projects: `[1] budget allocation optimization for large cap companies   aug 2025
    cobb-douglas production function + lagrange multipliers.

[2] healthcare go-to-market strategy                         oct 2024
    sales decks for 4 buyer segments, ~25 target accounts.`,

  education: `georgia institute of technology
b.s. industrial engineering   |   4.0 gpa, faculty honors
expected may 2027`,

  skills: `languages:   python, sql, javascript, html/css
libraries:   pandas, numpy, matplotlib, seaborn, scipy, scikit-learn`,

  contact: `email      me@aryanc.in
linkedin   linkedin.com/in/aryanchoudhari`,

  ls: `about/  experience/  projects/  education/  skills/  contact/  root/  [locked]`,
};

interface TerminalModeProps {
  onClose: () => void;
}

const TerminalMode = ({ onClose }: TerminalModeProps) => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<Line[]>([
    { type: "output", content: banner },
  ]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [snakeActive, setSnakeActive] = useState(false);
  const [matrixActive, setMatrixActive] = useState(false);
  const [vimActive, setVimActive] = useState(false);
  const vimAttemptsRef = useRef(0);
  const busyRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  const modeRef = useRef({ snake: false, matrix: false, vim: false });
  modeRef.current = { snake: snakeActive, matrix: matrixActive, vim: vimActive };
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, snakeActive]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const mode = modeRef.current;
      if (mode.snake || mode.matrix) return; // those handle their own keys
      if (mode.vim) {
        print("ESC won't save you here. this is vim. (:q!)");
        return;
      }
      onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);

  const print = (content: string) =>
    setHistory((h) => [...h, { type: "output", content }]);

  const printLater = (content: string, delay: number) => {
    timersRef.current.push(window.setTimeout(() => print(content), delay));
  };

  const runVim = (trimmed: string) => {
    if (/^:(q!?|wq|x)$/.test(trimmed)) {
      setVimActive(false);
      vimAttemptsRef.current = 0;
      print("you escaped vim. not everyone can say that.");
      return;
    }
    if (trimmed === "i") {
      print("you are now in insert mode. that made everything worse.");
      return;
    }
    const taunt = VIM_TAUNTS[Math.min(vimAttemptsRef.current, VIM_TAUNTS.length - 1)];
    vimAttemptsRef.current++;
    print(taunt);
  };

  const runRmRf = () => {
    busyRef.current = true;
    const steps = [
      "rm: removing /skills ... done",
      "rm: removing /education ... done",
      "rm: removing /experience ... done",
      "rm: removing /projects ... done",
      "rm: wait.",
      "rm: WAIT—",
    ];
    steps.forEach((s, i) => printLater(s, 300 * (i + 1)));
    timersRef.current.push(
      window.setTimeout(() => {
        onClose();
        window.dispatchEvent(new Event("aryan:break"));
      }, 300 * (steps.length + 1))
    );
  };

  const runCommand = (raw: string) => {
    const trimmed = raw.trim();
    setHistory((h) => [...h, { type: "input", content: trimmed }]);
    if (!trimmed) return;

    setCmdHistory((c) => [...c, trimmed]);
    setHistoryIdx(-1);

    if (vimActive) {
      runVim(trimmed);
      return;
    }
    if (busyRef.current) return;

    const [cmd, ...rest] = trimmed.split(/\s+/);
    const args = rest.join(" ");

    switch (cmd) {
      case "clear":
        setHistory([]);
        return;
      case "exit":
        onClose();
        return;
      case "date":
        print(new Date().toString());
        return;
      case "echo":
        print(args);
        return;
      case "vim":
      case "vi":
      case "nano":
        setVimActive(true);
        print(VIM_SCREEN);
        return;
      case "snake":
        print("loading snake... arrows/wasd to move, q to quit.");
        setSnakeActive(true);
        return;
      case "matrix":
        setMatrixActive(true);
        return;
      case "rm":
        if (/-[a-z]*r[a-z]*f|-[a-z]*f[a-z]*r/.test(args) && args.includes("/")) {
          runRmRf();
        } else {
          print(`rm: cannot remove '${args || "nothing"}': permission denied. (be braver: rm -rf /)`);
        }
        return;
      case "cd":
        if (args.replace(/\/$/, "") === "root") {
          print("cd: root/: permission denied. (you'll need sudo su)");
        } else {
          print("this isn't a real filesystem. or is it?");
        }
        return;
      case "sudo":
        if (args.startsWith("su")) {
          print("password: ********\naccess granted. entering /root ...");
          timersRef.current.push(
            window.setTimeout(() => {
              onClose();
              navigate("/root");
            }, 900)
          );
        } else {
          print("nice try. no sudo for you. ...unless? (sudo su)");
        }
        return;
    }

    const output = commands[cmd] ?? `command not found: ${cmd}. type 'help' for options.`;
    print(output);
  };

  const handleSnakeEnd = (score: number) => {
    setSnakeActive(false);
    print(
      score > 5
        ? `game over — score: ${score}. respectable.`
        : `game over — score: ${score}. the snake believes in you. type 'snake' to retry.`
    );
    timersRef.current.push(window.setTimeout(() => inputRef.current?.focus(), 50));
  };

  const handleMatrixExit = () => {
    setMatrixActive(false);
    print("...welcome back to the real world.");
    timersRef.current.push(window.setTimeout(() => inputRef.current?.focus(), 50));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      runCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const next = historyIdx < 0 ? cmdHistory.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(next);
      setInput(cmdHistory[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx < 0) return;
      const next = historyIdx + 1;
      if (next >= cmdHistory.length) {
        setHistoryIdx(-1);
        setInput("");
      } else {
        setHistoryIdx(next);
        setInput(cmdHistory[next] ?? "");
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black text-green-400 font-mono text-sm overflow-y-auto"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4 text-xs text-green-600">
          <span>{vimActive ? "aryan@portfolio:vim (trapped)" : "aryan@portfolio:~$"}</span>
          <button
            onClick={onClose}
            className="hover:text-green-400 transition-colors"
          >
            [ESC to close]
          </button>
        </div>

        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap leading-relaxed">
            {line.type === "input" ? (
              <>
                <span className="text-green-600">$ </span>
                {line.content}
              </>
            ) : (
              line.content
            )}
          </div>
        ))}

        {snakeActive && <TerminalSnake onEnd={handleSnakeEnd} />}

        {!snakeActive && (
          <div className="flex items-center mt-1">
            <span className="text-green-600">$&nbsp;</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-green-400 caret-green-400"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
          </div>
        )}

        <div ref={endRef} />
      </div>

      {matrixActive && <MatrixRain onExit={handleMatrixExit} />}
    </div>
  );
};

export default TerminalMode;
