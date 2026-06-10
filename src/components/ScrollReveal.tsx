import { useEffect } from "react";

const SCRAMBLE_CHARS = "!<>-_\\/[]{}=+*^?#";

const scramble = (el: HTMLElement) => {
  const original = el.textContent ?? "";
  if (!original || el.dataset.scrambled) return;
  el.dataset.scrambled = "true";

  let frame = 0;
  const totalFrames = Math.max(16, Math.round(original.length * 1.4));
  const tick = () => {
    frame++;
    const settled = Math.floor((original.length * frame) / totalFrames);
    el.textContent = original
      .split("")
      .map((ch, i) =>
        i < settled || ch === " "
          ? ch
          : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
      )
      .join("");
    if (frame < totalFrames) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = original;
    }
  };
  requestAnimationFrame(tick);
};

/** Fades sections in as they enter the viewport and decodes their headings. */
const ScrollReveal = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const sections = Array.from(document.querySelectorAll<HTMLElement>("section"));
    sections.forEach((s) => s.classList.add("reveal"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          el.classList.add("reveal-visible");
          const heading = el.querySelector<HTMLElement>("h2");
          if (heading) scramble(heading);
          observer.unobserve(el);
        });
      },
      { threshold: 0.12 }
    );
    sections.forEach((s) => observer.observe(s));

    return () => {
      observer.disconnect();
      sections.forEach((s) => s.classList.remove("reveal", "reveal-visible"));
    };
  }, []);

  return null;
};

export default ScrollReveal;
