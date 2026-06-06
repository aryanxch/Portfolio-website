import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const TRACK_URL = "/music.mp3";
const TRACK_NAME = "never gonna...";

const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = 0.35;
  }, []);

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

  return (
    <div className="flex items-center gap-2 min-w-0">
      <button
        onClick={toggle}
        aria-label={playing ? "pause music" : "play music"}
        title={playing ? "pause" : "play"}
        className="inline-flex items-center justify-center w-8 h-8 rounded border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors shrink-0"
      >
        {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </button>

      <div className="flex flex-col min-w-0">
        {playing ? (
          <div className="flex items-center gap-2">
            <EqBars />
            <span className="text-[11px] text-accent truncate">{TRACK_NAME}</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground truncate">
            {missing ? "track not found" : "play music"}
          </span>
        )}
      </div>

      <audio
        ref={audioRef}
        src={TRACK_URL}
        loop
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setMissing(true)}
      />
    </div>
  );
};

const EqBars = () => (
  <div className="flex items-end gap-[2px] h-3">
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
