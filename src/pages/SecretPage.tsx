import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BANNER = `
 ██████╗  ██████╗  ██████╗ ████████╗
 ██╔══██╗██╔═══██╗██╔═══██╗╚══██╔══╝
 ██████╔╝██║   ██║██║   ██║   ██║
 ██╔══██╗██║   ██║██║   ██║   ██║
 ██║  ██║╚██████╔╝╚██████╔╝   ██║
 ╚═╝  ╚═╝ ╚═════╝  ╚═════╝    ╚═╝
`;

const STATS = [
  { label: "caffeine", pct: 78, note: "refill scheduled" },
  { label: "sleep debt", pct: 91, note: "critical" },
  { label: "luck", pct: 34, note: "recharging" },
  { label: "gpa", pct: 100, note: "4.00 — read-only" },
];

const LOGS = [
  "[2005] process spawned in india. boot successful.",
  "[2023] migrated to georgia tech. environment variables updated.",
  "[2024] learned that factories are just very large optimization problems.",
  "[2026] discovered easter eggs are more fun than homework. no regrets.",
];

const SecretPage = () => {
  const [wipe, setWipe] = useState(true);

  useEffect(() => {
    document.title = "root@aryan";
    const t = window.setTimeout(() => setWipe(false), 900);
    return () => {
      window.clearTimeout(t);
      document.title = "Aryan Choudhari - Portfolio";
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono text-sm">
      {wipe && <div className="page-wipe" aria-hidden />}

      <div className="max-w-2xl mx-auto p-6 sm:p-10 space-y-8">
        <pre className="text-green-500 text-[10px] sm:text-xs leading-tight">{BANNER}</pre>

        <div>
          <p className="text-green-600"># access granted</p>
          <p className="mt-2 leading-relaxed">
            welcome, root. you found the inner sanctum. there's nothing of
            commercial value here — just the control panel for one (1) human.
          </p>
        </div>

        <div>
          <p className="text-green-600 mb-3"># system status</p>
          <div className="space-y-3">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{s.label}</span>
                  <span className="text-green-600">{s.note}</span>
                </div>
                <div className="h-2 border border-green-800 rounded-sm overflow-hidden">
                  <div
                    className="h-full bg-green-500/70"
                    style={{ width: `${s.pct}%`, boxShadow: "0 0 8px rgba(34,197,94,0.6)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-green-600 mb-2"># classified logs</p>
          <div className="space-y-1 text-xs leading-relaxed">
            {LOGS.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
        </div>

        <div>
          <p className="text-green-600 mb-2"># secret_plans.txt</p>
          <pre className="text-xs leading-relaxed">{`1. learn the family business inside out
2. grow it
3. [REDACTED]`}</pre>
        </div>

        <div className="text-xs text-green-700 italic">
          psst — back on the main page, try ↑ ↑ ↓ ↓ ← → ← → B A.
        </div>

        <Link
          to="/"
          className="inline-block border border-green-700 px-4 py-2 text-green-400 hover:bg-green-500/10 transition-colors"
        >
          $ logout
        </Link>
      </div>
    </div>
  );
};

export default SecretPage;
