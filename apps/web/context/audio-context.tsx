"use client";

import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from "react";

export interface AudioTrack {
  id: number;
  title: string;
  artist: string | null;
  duration: number | null;
  fileKey: string;
}

interface AudioContextState {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playTrack: (track: AudioTrack) => void;
  togglePlayPause: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
}

const AudioContext = createContext<AudioContextState | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;

      const handleTimeUpdate = () => {
        if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
      };
      
      const handleLoadedMetadata = () => {
        if (audioRef.current) setDuration(audioRef.current.duration);
      };

      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
      audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
      audioRef.current.addEventListener("ended", handleEnded);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
          audioRef.current.removeEventListener("loadedmetadata", handleLoadedMetadata);
          audioRef.current.removeEventListener("ended", handleEnded);
        }
      };
    }
  }, []);

  const playTrack = (track: AudioTrack) => {
    if (!audioRef.current) return;
    
    // If playing the same track, just toggle play
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
    audioRef.current.src = `${apiUrl}/api/assets/${track.id}/stream`;
    
    audioRef.current.play().then(() => {
      setIsPlaying(true);
      setCurrentTrack(track);
      if (track.duration) {
        setDuration(track.duration);
      }
    }).catch(err => {
      console.error("Audio playback failed", err);
      setIsPlaying(false);
    });
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !currentTrack) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.error(err));
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (vol: number) => {
    if (audioRef.current) {
      audioRef.current.volume = vol;
      setVolumeState(vol);
    }
  };

  return (
    <AudioContext.Provider value={{
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      volume,
      playTrack,
      togglePlayPause,
      seek,
      setVolume
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
