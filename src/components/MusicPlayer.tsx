import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const TRACK_URL = `${import.meta.env.BASE_URL}music.mp3`;
const TRACK_LABEL = "play music";

const fmt = (sec: number) => {
  if (!isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [missing, setMissing] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [scrubbing, setScrubbing] = useState(false);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = 0.35;
  }, []);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => {
      if (!scrubbing) setCurrentTime(a.currentTime);
    };
    const onMeta = () => setDuration(a.duration || 0);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("durationchange", onMeta);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("durationchange", onMeta);
    };
  }, [scrubbing]);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      return;
    }
    try {
      await a.play();
      setMissing(false);
    } catch {
      setMissing(true);
    }
  };

  const seekToClientX = (clientX: number) => {
    const track = trackRef.current;
    const a = audioRef.current;
    if (!track || !a || !duration) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const t = ratio * duration;
    a.currentTime = t;
    setCurrentTime(t);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setScrubbing(true);
    seekToClientX(e.clientX);
    const onMove = (m: PointerEvent) => seekToClientX(m.clientX);
    const onUp = () => {
      setScrubbing(false);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-2.5 border border-border rounded-3xl px-4 py-3 bg-muted/30">
      {/* Top row: play button + label (with eq when playing) */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={toggle}
          aria-label={playing ? "pause music" : "play music"}
          title={playing ? "pause" : "play"}
          className="inline-flex items-center justify-center w-8 h-8 rounded border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors shrink-0"
        >
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <div className="flex items-center gap-2 min-w-0 flex-1">
          {playing && <EqBars />}
          <span
            className={`text-xs truncate ${
              playing ? "text-accent" : "text-muted-foreground"
            }`}
          >
            {missing ? "track not found" : TRACK_LABEL}
          </span>
        </div>
      </div>

      {/* Progress track */}
      <div className="flex items-center gap-2 text-[10px] text-muted-foreground tabular-nums font-mono">
        <span style={{ minWidth: 26 }}>{fmt(currentTime)}</span>

        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          className="flex-1 relative h-1 bg-border rounded-full select-none touch-none group"
          role="slider"
          aria-label="seek"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(currentTime)}
          tabIndex={0}
        >
          {/* Filled portion */}
          <div
            className="absolute inset-y-0 left-0 bg-accent rounded-full"
            style={{
              width: `${progress}%`,
              boxShadow: "0 0 4px rgba(34,197,94,0.5)",
            }}
          />
          {/* Scrubber thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 -ml-1 rounded-full bg-accent transition-transform group-hover:scale-125"
            style={{
              left: `${progress}%`,
              boxShadow: "0 0 6px rgba(34,197,94,0.9)",
              opacity: duration > 0 ? 1 : 0,
              transform: scrubbing ? "translateY(-50%) scale(1.4)" : undefined,
            }}
          />
        </div>

        <span style={{ minWidth: 26 }} className="text-right">
          {fmt(duration)}
        </span>
      </div>

      <audio
        ref={audioRef}
        src={TRACK_URL}
        loop
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setMissing(true)}
      />
    </div>
  );
};

const EqBars = () => (
  <div className="flex items-end gap-[2px] h-3 shrink-0">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="eq-bar w-[2px] bg-accent inline-block"
        style={{ animationDelay: `${i * 130}ms` }}
      />
    ))}
  </div>
);

export default MusicPlayer;
