"use client";

import useSWR from "swr";
import { useAudio, AudioTrack } from "@/context/audio-context";
import { Play, Pause, Music, Loader2 } from "lucide-react";
import { motion } from "motion/react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function formatTime(seconds: number | null) {
  if (!seconds || isNaN(seconds)) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function TrackList() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
  const { data: tracks, error } = useSWR<AudioTrack[]>(
    `${apiUrl}/api/assets`,
    fetcher
  );

  const { currentTrack, isPlaying, playTrack } = useAudio();

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 dark:bg-red-500/10 rounded-2xl border border-red-200 dark:border-red-500/20">
        Failed to load tracks. Please try again later.
      </div>
    );
  }

  if (!tracks) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-neutral-500">
        <Loader2 size={32} className="animate-spin mb-4" />
        <p>Loading tracks...</p>
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm text-neutral-500">
        <Music size={48} className="mb-4 opacity-50" />
        <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">No music yet</h3>
        <p className="text-center max-w-sm">Check back later for new tracks.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {tracks.map((track, index) => {
        const isCurrentTrack = currentTrack?.id === track.id;
        const isCurrentlyPlaying = isCurrentTrack && isPlaying;

        return (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:shadow-md cursor-pointer
              ${isCurrentTrack 
                ? "bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 shadow-sm" 
                : "bg-white/50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 hover:bg-white dark:hover:bg-neutral-800"
              }`}
            onClick={() => playTrack(track)}
          >
            {/* Play Button / Equalizer animation */}
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 rounded-lg text-neutral-900 dark:text-white group-hover:scale-105 transition-transform">
              {isCurrentlyPlaying ? (
                <div className="flex items-end gap-1 h-4">
                  <motion.div animate={{ height: ["40%", "100%", "40%"] }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} className="w-1 bg-current rounded-full" />
                  <motion.div animate={{ height: ["100%", "40%", "100%"] }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} className="w-1 bg-current rounded-full" />
                  <motion.div animate={{ height: ["60%", "100%", "60%"] }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} className="w-1 bg-current rounded-full" />
                </div>
              ) : (
                <Play size={20} className="fill-current ml-1 opacity-70 group-hover:opacity-100" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold truncate ${isCurrentTrack ? "text-blue-600 dark:text-blue-400" : "text-neutral-900 dark:text-white"}`}>
                {track.title}
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
                {track.artist || "Unknown Artist"}
              </p>
            </div>

            <div className="text-sm font-mono text-neutral-400 dark:text-neutral-500 hidden sm:block">
              {formatTime(track.duration)}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
