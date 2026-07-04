import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Meeting | Nitish Deshmukh",
  description: "Schedule a time to chat about projects, collaborations, or anything else.",
};

export default function MeetingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-24 min-h-[85vh] flex flex-col">
      <header className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
          Book a Meeting
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Schedule a time to chat about projects, collaborations, or anything else. Pick a slot that works best for you.
        </p>
      </header>

      <div className="flex-1 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm shadow-sm overflow-hidden min-h-[700px]">
        <iframe
          src="https://cal.com/nitish-deshmukh-24?embed=true&theme=auto"
          width="100%"
          height="100%"
          frameBorder="0"
          className="w-full h-full min-h-[700px]"
          title="Schedule a meeting with Nitish Deshmukh"
        />
      </div>
    </div>
  );
}
