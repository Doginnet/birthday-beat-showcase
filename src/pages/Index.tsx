import { useState, useRef, useCallback, useEffect } from "react";
import { Play } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import TrackRow from "@/components/TrackRow";

interface Track {
  name: string;
  duration: string;
  durationSeconds: number;
  src: string;
}

const TRACKS: Track[] = [
  { name: "Track 01 — Midnight Pulse", duration: "03:42", durationSeconds: 222, src: "" },
  { name: "Track 02 — Neon Drift", duration: "04:15", durationSeconds: 255, src: "" },
  { name: "Track 03 — Echo Chamber", duration: "03:58", durationSeconds: 238, src: "" },
  { name: "Track 04 — Static Bloom", duration: "05:01", durationSeconds: 301, src: "" },
  { name: "Track 05 — Last Signal", duration: "04:33", durationSeconds: 273, src: "" },
];

const ALBUM_NAME = "AFTERGLOW";

const Index = () => {
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState<number[]>(new Array(TRACKS.length).fill(0));
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animFrameRef = useRef<number>(0);

  const updateProgress = useCallback(() => {
    const audio = audioRef.current;
    if (audio && currentTrack !== null && !audio.paused) {
      const p = audio.duration ? audio.currentTime / audio.duration : 0;
      setProgress((prev) => {
        const next = [...prev];
        next[currentTrack] = p;
        return next;
      });
      animFrameRef.current = requestAnimationFrame(updateProgress);
    }
  }, [currentTrack]);

  useEffect(() => {
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  const playTrack = useCallback(
    (index: number) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (currentTrack === index && isPlaying) {
        audio.pause();
        setIsPlaying(false);
        cancelAnimationFrame(animFrameRef.current);
        return;
      }

      if (currentTrack !== index) {
        // Reset previous track progress is optional — keep it for UX
        const src = TRACKS[index].src;
        if (src) {
          audio.src = src;
          audio.load();
        }
        setCurrentTrack(index);
      }

      if (TRACKS[index].src) {
        audio.play().then(() => {
          setIsPlaying(true);
          animFrameRef.current = requestAnimationFrame(updateProgress);
        }).catch(() => {
          // No audio source yet
        });
      } else {
        // Demo mode: simulate playback
        setIsPlaying(true);
        setCurrentTrack(index);
        simulatePlayback(index);
      }
    },
    [currentTrack, isPlaying, updateProgress]
  );

  const simulatePlayback = useCallback((index: number) => {
    // Simple demo simulation when no audio file is loaded
    let startTime = Date.now();
    const existingProgress = progress[index];
    const totalMs = TRACKS[index].durationSeconds * 1000;
    const startOffset = existingProgress * totalMs;

    const tick = () => {
      const elapsed = Date.now() - startTime + startOffset;
      const p = Math.min(elapsed / totalMs, 1);
      setProgress((prev) => {
        const next = [...prev];
        next[index] = p;
        return next;
      });
      if (p < 1) {
        animFrameRef.current = requestAnimationFrame(tick);
      } else {
        // Auto-play next
        setIsPlaying(false);
        if (index < TRACKS.length - 1) {
          setTimeout(() => playTrack(index + 1), 300);
        }
      }
    };
    cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(tick);
  }, [progress]);

  const handlePlayAll = () => {
    setProgress(new Array(TRACKS.length).fill(0));
    playTrack(0);
  };

  const handleSeek = (index: number, percent: number) => {
    const audio = audioRef.current;
    if (TRACKS[index].src && audio && currentTrack === index) {
      audio.currentTime = percent * audio.duration;
    }
    // Update progress visually
    setProgress((prev) => {
      const next = [...prev];
      next[index] = percent;
      return next;
    });
  };

  const handleDownload = (index: number) => {
    const src = TRACKS[index].src;
    if (src) {
      const a = document.createElement("a");
      a.href = src;
      a.download = `${TRACKS[index].name}.mp3`;
      a.click();
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    if (currentTrack !== null && currentTrack < TRACKS.length - 1) {
      playTrack(currentTrack + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onTimeUpdate={() => {
          if (audioRef.current && currentTrack !== null) {
            const p = audioRef.current.duration
              ? audioRef.current.currentTime / audioRef.current.duration
              : 0;
            setProgress((prev) => {
              const next = [...prev];
              next[currentTrack] = p;
              return next;
            });
          }
        }}
      />

      <HeroSection />

      {/* Album section */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 pb-20 -mt-8">
        {/* Album header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs text-muted-foreground tracking-[0.3em] uppercase mb-1">
              Album
            </p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-wider text-foreground">
              {ALBUM_NAME}
            </h2>
          </div>
          <button
            onClick={handlePlayAll}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-neon-red text-primary-foreground text-sm font-semibold tracking-wider uppercase transition-all duration-300 hover:scale-105 neon-glow-red"
          >
            <Play className="w-4 h-4" fill="currentColor" />
            Play All
          </button>
        </div>

        {/* Track list */}
        <div className="flex flex-col gap-3">
          {TRACKS.map((track, i) => (
            <TrackRow
              key={i}
              index={i}
              name={track.name}
              duration={track.duration}
              isPlaying={currentTrack === i && isPlaying}
              progress={progress[i]}
              onPlayPause={() => playTrack(i)}
              onSeek={(p) => handleSeek(i, p)}
              onDownload={() => handleDownload(i)}
              audioSrc={track.src}
            />
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-muted-foreground text-xs mt-12 tracking-widest uppercase">
          Made with love ♥
        </p>
      </main>
    </div>
  );
};

export default Index;
