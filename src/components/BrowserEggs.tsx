import { useEffect } from "react";
import { blip } from "@/lib/sfx";

const ASCII = `
   _   ___ __   __ _   _  _
  /_\\ | _ \\\\ \\ / // \\ | \\| |
 / _ \\|   / \\ V // _ \\| .\` |
/_/ \\_\\_|_\\  |_|/_/ \\_\\_|\\_|
`;

const BrowserEggs = () => {
  // console easter egg
  useEffect(() => {
    const w = window as unknown as { hire?: (name?: string) => string; __eggShown?: boolean };
    if (w.__eggShown) return;
    w.__eggShown = true;

    console.log(`%c${ASCII}`, "color: #22c55e; font-weight: bold;");
    console.log(
      "%csnooping around the devtools? i like that.\n%ctype %chire('aryan')%c and hit enter.",
      "color: #22c55e;",
      "color: #888;",
      "color: #22c55e; font-weight: bold;",
      "color: #888;"
    );

    w.hire = (name?: string) => {
      if (name && name.toLowerCase() !== "aryan") {
        return `hire('${name}')? bold move. but you probably meant hire('aryan').`;
      }
      console.log(
        "%cexcellent choice.\n\n  email     me@aryanc.in\n  linkedin  linkedin.com/in/aryanchoudhari\n\n%cp.s. you found the console egg. there are more on the page.",
        "color: #22c55e; font-size: 13px;",
        "color: #888; font-style: italic;"
      );
      return "offer letter pending...";
    };
  }, []);

  // soft blip on every link/button click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target;
      if (t instanceof HTMLElement && t.closest("a, button, [role='button']")) blip();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // tab-blur title tease
  useEffect(() => {
    const original = document.title;
    const onVisibility = () => {
      document.title = document.hidden ? "come back :(" : original;
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      document.title = original;
    };
  }, []);

  return null;
};

export default BrowserEggs;
