import { Play, Pause, Download } from "lucide-react";

interface TrackRowProps {
  index: number;
  name: string;
  duration: string;
  isPlaying: boolean;
  progress: number;
  onPlayPause: () => void;
  onSeek: (percent: number) => void;
  onDownload: () => void;
  audioSrc: string;
}

const TrackRow = ({
  index,
  name,
  duration,
  isPlaying,
  progress,
  onPlayPause,
  onSeek,
  onDownload,
}: TrackRowProps) => {
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    onSeek(Math.max(0, Math.min(1, percent)));
  };

  return (
    <div className="glass rounded-lg p-4 flex items-center gap-4 group transition-all duration-300 hover:border-neon-red/20">
      {/* Track number */}
      <span className="text-muted-foreground text-sm w-6 text-right font-mono">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Play/Pause */}
      <button
        onClick={onPlayPause}
        className="w-10 h-10 rounded-full flex items-center justify-center border border-muted-foreground/30 hover:border-neon-red transition-all duration-200 hover:neon-glow-red flex-shrink-0"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 text-neon-red" fill="currentColor" />
        ) : (
          <Play className="w-4 h-4 text-foreground ml-0.5" fill="currentColor" />
        )}
      </button>

      {/* Track info + progress */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium truncate ${isPlaying ? "text-neon-red" : "text-foreground"}`}>
            {name}
          </span>
          <span className="text-xs text-muted-foreground ml-4 flex-shrink-0 font-mono">
            {duration}
          </span>
        </div>

        {/* Timeline */}
        <div
          className="w-full h-1 bg-muted rounded-full cursor-pointer group/progress"
          onClick={handleProgressClick}
        >
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{
              width: `${progress * 100}%`,
              backgroundColor: "hsl(var(--neon-red))",
              boxShadow:
                progress > 0
                  ? "0 0 8px hsl(340 90% 55% / 0.6), 0 0 20px hsl(340 90% 55% / 0.3)"
                  : "none",
            }}
          />
        </div>
      </div>

      {/* Download */}
      <button
        onClick={onDownload}
        className="text-muted-foreground hover:text-neon-purple transition-colors duration-200 flex-shrink-0"
        title="Download track"
      >
        <Download className="w-4 h-4" />
      </button>
    </div>
  );
};

export default TrackRow;
