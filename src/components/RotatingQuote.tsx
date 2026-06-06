import { useEffect, useState } from "react";

const quotes: Array<{ text: string; attribution?: string }> = [
  {
    text: "It ain't what you don't know that gets you into trouble. It's what you know for sure that just ain't so.",
    attribution: "Mark Twain",
  },
  {
    text: "He had hit rock bottom and I fear he will dig again.",
  },
];

const ROTATE_MS = 8000;
const FADE_MS = 400;

const RotatingQuote = () => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % quotes.length);
        setVisible(true);
      }, FADE_MS);
    }, ROTATE_MS);
    return () => clearInterval(interval);
  }, []);

  const quote = quotes[index];

  return (
    <blockquote
      className="border-l-2 border-border pl-4 transition-opacity"
      style={{ opacity: visible ? 1 : 0, transitionDuration: `${FADE_MS}ms` }}
    >
      <p className="text-base font-serif italic leading-relaxed">
        &ldquo;{quote.text}&rdquo;
      </p>
      {quote.attribution && (
        <footer className="text-sm text-muted-foreground mt-2">
          &mdash; {quote.attribution}
        </footer>
      )}
    </blockquote>
  );
};

export default RotatingQuote;
