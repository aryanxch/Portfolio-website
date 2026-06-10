type Direction = "up" | "down" | "flat";

interface Tick {
  symbol: string;
  value: string;
  dir: Direction;
}

const TICKS: Tick[] = [
  { symbol: "GPA", value: "4.00", dir: "up" },
  { symbol: "SLEEP", value: "6.2 HRS", dir: "down" },
  { symbol: "CHAI", value: "3 CUPS", dir: "up" },
  { symbol: "LEETCODE", value: "0", dir: "down" },
  { symbol: "TABS OPEN", value: "47", dir: "up" },
  { symbol: "SCREEN TIME", value: "9.4 HRS", dir: "up" },
  { symbol: "PHONE BATT", value: "12%", dir: "down" },
  { symbol: "ASSIGNMENTS DUE", value: "3", dir: "up" },
  { symbol: "MOTIVATION", value: "VOLATILE", dir: "flat" },
  { symbol: "LAUNDRY", value: "OVERDUE", dir: "down" },
  { symbol: "GYM STREAK", value: "2 DAYS", dir: "up" },
  { symbol: "UNREAD EMAILS", value: "212", dir: "up" },
];

const arrow = (dir: Direction) => (dir === "up" ? "▲" : dir === "down" ? "▼" : "◆");

const dirClass = (dir: Direction) =>
  dir === "up" ? "text-accent" : dir === "down" ? "text-red-500" : "text-muted-foreground";

const TickerRun = () => (
  <div className="flex shrink-0 items-center" aria-hidden>
    {TICKS.map((t) => (
      <span key={t.symbol} className="flex items-baseline gap-1.5 px-5 whitespace-nowrap">
        <span className="text-muted-foreground">{t.symbol}</span>
        <span className={dirClass(t.dir)}>
          {arrow(t.dir)} {t.value}
        </span>
      </span>
    ))}
  </div>
);

const TickerTape = () => (
  <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/90 backdrop-blur-sm overflow-hidden">
    <div className="ticker-track flex w-max font-mono text-[11px] tracking-wide py-1.5">
      <TickerRun />
      <TickerRun />
    </div>
  </div>
);

export default TickerTape;
