import { useState, useRef, useCallback } from "react";
import { Play } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import TrackRow from "@/components/TrackRow";

// ╔══════════════════════════════════════════════════════════════╗
// ║  🎵 TRACK LIST — Edit track names, durations, and files here ║
// ╚══════════════════════════════════════════════════════════════╝
// To add your own music:
//   1. Place your .mp3 files in the /public folder
//   2. Set the `src` to "/your-file-name.mp3"
//   3. Update `name`, `duration`, and `durationSeconds` to match

interface Track {
  name: string;
  duration: string;
  durationSeconds: number;
  src: string;
}

const TRACKS: Track[] = [
  { name: "Track 01 — Cathlik", duration: "05:33", durationSeconds: 333, src: "/audio/Cathlik.mp3" },
  { name: "Track 02 — Smth", duration: "05:15", durationSeconds: 315, src: "/audio/Smth.mp3" },
  { name: "Track 03 — Until", duration: "07:05", durationSeconds: 425, src: "/audio/Until.mp3" },
  { name: "Track 04 — Semicircles", duration: "05:46", durationSeconds: 346, src: "/audio/Semicircles.mp3" },
  { name: "Track 05 — Ether", duration: "08:41", durationSeconds: 521, src: "/audio/Ether.mp3" },
  { name: "Track 06 — Kitsune", duration: "07:00", durationSeconds: 420, src: "/audio/Kitsune.mp3" },
];

// ╔══════════════════════════════════════════════════════════════╗
// ║  📝 ALBUM NAME — Change the album title here                ║
// ╚══════════════════════════════════════════════════════════════╝
const ALBUM_NAME = "BIRTHDAY-EP'57 (2026)";

// ═══════════════════════════════════════════════════════════════
//  🎧 AUDIO PLAYER LOGIC — handles play/pause/seek/progress
// ═══════════════════════════════════════════════════════════════

const Index = () => {
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState<number[]>(new Array(TRACKS.length).fill(0));
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // ── Reset all track progress bars to zero ──
  const resetAllProgress = useCallback(() => {
    setProgress(new Array(TRACKS.length).fill(0));
  }, []);

  // ── Play or pause a track by index ──
  const playTrack = useCallback(
    (index: number) => {
      const audio = audioRef.current;
      if (!audio) return;

      // If clicking the same track that's playing → pause it
      if (currentTrack === index && isPlaying) {
        audio.pause();
        setIsPlaying(false);
        return;
      }

      // Switching to a different track → reset progress, change src, and set as current
      if (currentTrack !== index) {
        resetAllProgress();
        audio.src = TRACKS[index].src;
        audio.load();
        setCurrentTrack(index);
      }

      // Play the track (it will be the new one if switched, or resumed if paused)
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
    },
    [currentTrack, isPlaying, resetAllProgress]
  );

  // ── "Play All" button handler ──
  const handlePlayAll = () => {
    resetAllProgress();
    playTrack(0);
  };

  // ── Seek to a position in the current track ──
  const handleSeek = (index: number, percent: number) => {
    const audio = audioRef.current;
    if (TRACKS[index].src && audio && currentTrack === index) {
      audio.currentTime = percent * audio.duration;
    }
    setProgress((prev) => {
      const next = [...prev];
      next[index] = percent;
      return next;
    });
  };

  // ── Download a track ──
  const handleDownload = (index: number) => {
    const src = TRACKS[index].src;
    if (src) {
      const a = document.createElement("a");
      a.href = src;
      a.download = `${TRACKS[index].name}.mp3`;
      a.click();
    }
  };

  // ── When a track ends, auto-play next ──
  const handleAudioEnded = () => {
    setIsPlaying(false);
    if (currentTrack !== null && currentTrack < TRACKS.length - 1) {
      playTrack(currentTrack + 1);
    }
  };

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  🎨 PAGE LAYOUT — Edit styles and structure below           ║
  // ╚══════════════════════════════════════════════════════════════╝

  return (
    <div className="min-h-screen bg-black">
      {/* Background Image Layer */}
      <div className="fixed inset-0 z-0 bg-[url('@/assets/hero-bg.jpg')] bg-cover bg-center bg-no-repeat blur"></div>

      {/* Vignette Overlay */}
      <div className="fixed inset-0 z-20 pointer-events-none  bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.6)_90%)]"></div>

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

      {/* Scrollable Content Container */}
      <div className="relative z-10 -top-[55px]  ">
        <HeroSection />

        <div className="relative z-30 max-w-3xl mx-auto mt-8  p-8 mb-10 rounded-[25px] border border-white/10 bg-gradient-to-b from-[rgba(25,25,25,0.5)] to-[rgba(25,25,25,0.2)] backdrop-blur-md">
          <main className="px-4 pb-8">
            {/* Album header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                              <p className="text-xs ml-1 text-muted-foreground tracking-[0.3em] uppercase mb-1 ">
                                EP
                              </p>
                              <img
                                src="src/assets/cover.jpg"
                                alt="Album Cover"
                                className="w-20 h-20 object-cover rounded-md mb-2"
                              />
                              <h2 className="text-2xl md:text-3xl font-bold tracking-wider text-foreground text-neon-purple neon-shadow-album">                  {ALBUM_NAME}
                </h2>
              </div>
              <button
                onClick={handlePlayAll}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-neon-red text-primary-foreground text-sm font-semibold tracking-wider uppercase transition-all duration-300 hover:scale-105 hover:neon-glow-red"
              >
                <Play className="w-4 h-4" fill="currentColor" />
                Play All
              </button>
            </div>

            {/* Track list (each row: src/components/TrackRow.tsx) */}
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

            {/* ── Footer text ── */}
            <p className="text-center text-muted-foreground text-xs mt-12 tracking-widest uppercase">
              Made with love ♥
            </p>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
