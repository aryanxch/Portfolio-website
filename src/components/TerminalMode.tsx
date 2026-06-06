import { useEffect, useRef, useState } from "react";

type Line = { type: "input" | "output"; content: string };

const banner = `
  ┌──────────────────────────────────────────┐
  │  aryan.terminal  v1.0                    │
  │  type 'help' to see available commands   │
  └──────────────────────────────────────────┘
`;

const commands: Record<string, string> = {
  help: `available commands:
  whoami        about me
  experience    work history
  projects      what i've built
  education     where i study
  skills        what i know
  contact       how to reach me
  ls            list sections
  date          current date and time
  echo          echo back what you type
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

  ls: `about/  experience/  projects/  education/  skills/  contact/`,
};

interface TerminalModeProps {
  onClose: () => void;
}

const TerminalMode = ({ onClose }: TerminalModeProps) => {
  const [history, setHistory] = useState<Line[]>([
    { type: "output", content: banner },
  ]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const runCommand = (raw: string) => {
    const trimmed = raw.trim();
    setHistory((h) => [...h, { type: "input", content: trimmed }]);
    if (!trimmed) return;

    setCmdHistory((c) => [...c, trimmed]);
    setHistoryIdx(-1);

    const [cmd, ...rest] = trimmed.split(/\s+/);
    const args = rest.join(" ");

    if (cmd === "clear") {
      setHistory([]);
      return;
    }
    if (cmd === "exit") {
      onClose();
      return;
    }
    if (cmd === "date") {
      setHistory((h) => [...h, { type: "output", content: new Date().toString() }]);
      return;
    }
    if (cmd === "echo") {
      setHistory((h) => [...h, { type: "output", content: args }]);
      return;
    }
    if (cmd === "sudo") {
      setHistory((h) => [
        ...h,
        { type: "output", content: "nice try. no sudo for you." },
      ]);
      return;
    }

    const output = commands[cmd] ?? `command not found: ${cmd}. type 'help' for options.`;
    setHistory((h) => [...h, { type: "output", content: output }]);
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
          <span>aryan@portfolio:~$</span>
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

        <div ref={endRef} />
      </div>
    </div>
  );
};

export default TerminalMode;
