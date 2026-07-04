import { Metadata } from "next";
import { TrackList } from "@/components/music/track-list";
import { Disc3 } from "lucide-react";

export const metadata: Metadata = {
  title: "Music | Nitish Deshmukh",
  description: "Listen to my musical assets directly from the portfolio.",
};

export default function MusicPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-16 pb-24">
      <header className="mb-12 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
            Music Library
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            A collection of tracks and audio experiments. Play any track and it will continue playing as you browse the site.
          </p>
        </div>
        <div className="hidden sm:flex items-center justify-center w-16 h-16 bg-neutral-100 dark:bg-neutral-900 rounded-2xl text-neutral-400 dark:text-neutral-500 transform rotate-12">
          <Disc3 size={32} />
        </div>
      </header>

      <main>
        <TrackList />
      </main>
    </div>
  );
}
