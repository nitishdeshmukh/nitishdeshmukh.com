"use client";

import { useAudio } from "@/context/audio-context";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

function formatTime(seconds: number) {
  if (isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function StickyPlayer() {
  const { currentTrack, isPlaying, currentTime, duration, volume, togglePlayPause, seek, setVolume } = useAudio();
  const [showVolume, setShowVolume] = useState(false);

  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-[calc(env(safe-area-inset-bottom)+80px)] left-1/2 -translate-x-1/2 w-[95%] max-w-md z-40"
      >
        <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-2xl p-3 shadow-lg flex flex-col gap-2">
          
          {/* Main Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlayPause}
              className="flex-shrink-0 h-10 w-10 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
            >
              {isPlaying ? <Pause size={18} className="fill-current" /> : <Play size={18} className="fill-current ml-1" />}
            </button>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                {currentTrack.title}
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                {currentTrack.artist || "Unknown Artist"}
              </p>
            </div>

            <div className="relative flex items-center">
              <button 
                onClick={() => setShowVolume(!showVolume)}
                className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              
              {/* Volume Popover */}
              {showVolume && (
                <div className="absolute bottom-full right-0 mb-2 p-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-lg">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-24 accent-neutral-900 dark:accent-white"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 px-1 text-[10px] font-medium text-neutral-500 font-mono">
            <span>{formatTime(currentTime)}</span>
            <div 
              className="flex-1 h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden cursor-pointer relative group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percentage = x / rect.width;
                seek(percentage * duration);
              }}
            >
              <div 
                className="absolute top-0 left-0 h-full bg-neutral-900 dark:bg-white rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span>{formatTime(duration)}</span>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
