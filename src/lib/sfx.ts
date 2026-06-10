// Tiny Web Audio sound effects. No audio files — everything is synthesized.
// The AudioContext is created lazily on first use (must be inside a user gesture).

let ctx: AudioContext | null = null;
let enabled: boolean | null = null;

const STORAGE_KEY = "aryan-sfx";

export const isSfxEnabled = (): boolean => {
  if (enabled === null) {
    enabled = typeof window === "undefined" ? true : localStorage.getItem(STORAGE_KEY) !== "off";
  }
  return enabled;
};

export const setSfxEnabled = (on: boolean) => {
  enabled = on;
  localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
};

const ensureCtx = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      ctx = new AudioContext();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
};

interface ToneOpts {
  freq: number;
  endFreq?: number;
  duration: number;
  type?: OscillatorType;
  gain?: number;
}

const tone = ({ freq, endFreq, duration, type = "square", gain = 0.03 }: ToneOpts) => {
  if (!isSfxEnabled()) return;
  const ac = ensureCtx();
  if (!ac) return;

  const osc = ac.createOscillator();
  const g = ac.createGain();
  const now = ac.currentTime;

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

  g.gain.setValueAtTime(gain, now);
  g.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(g);
  g.connect(ac.destination);
  osc.start(now);
  osc.stop(now + duration + 0.02);
};

/** Soft UI click for links and buttons. */
export const blip = () => tone({ freq: 880, duration: 0.05, type: "square", gain: 0.018 });

/** Laser-ish shot for hitting targets / the photo. */
export const shoot = () =>
  tone({ freq: 700, endFreq: 90, duration: 0.14, type: "sawtooth", gain: 0.035 });

/** Deeper crash for shattering things. */
export const crash = () =>
  tone({ freq: 200, endFreq: 35, duration: 0.45, type: "sawtooth", gain: 0.05 });

/** Cheerful pop (e.g. snake eats food). */
export const pop = () => tone({ freq: 440, endFreq: 880, duration: 0.08, type: "triangle", gain: 0.035 });
