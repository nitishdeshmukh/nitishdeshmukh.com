"use client";

import useSWR from "swr";
import { usePusher } from "@/hooks/use-pusher";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Loader2, Calendar } from "lucide-react";

interface GuestbookEntry {
  id: number;
  name: string;
  message: string;
  createdAt: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function MessageList() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
  const { data: messages, error, mutate, isValidating } = useSWR<GuestbookEntry[]>(
    `${apiUrl}/api/guestbook`,
    fetcher
  );

  // Subscribe to real-time updates via Pusher
  usePusher("guestbook", "update", () => {
    // Revalidate when a new message is approved
    mutate();
  });
  
  usePusher("guestbook", "delete", () => {
    // Revalidate when a message is deleted
    mutate();
  });

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 dark:bg-red-500/10 rounded-2xl border border-red-200 dark:border-red-500/20">
        Failed to load messages. Please try again later.
      </div>
    );
  }

  if (!messages) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-neutral-500">
        <Loader2 size={32} className="animate-spin mb-4" />
        <p>Loading guestbook...</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm text-neutral-500">
        <MessageSquare size={48} className="mb-4 opacity-50" />
        <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">No messages yet</h3>
        <p className="text-center max-w-sm">Be the first to sign the guestbook! Your message will appear here after approval.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Optional refresh indicator for slow connections */}
      {isValidating && (
        <div className="absolute -top-8 right-0 text-xs text-neutral-400 flex items-center gap-1.5">
          <Loader2 size={12} className="animate-spin" />
          Updating...
        </div>
      )}

      <AnimatePresence initial={false}>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring", bounce: 0.3 }}
            className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
              <h3 className="font-bold text-neutral-900 dark:text-white text-lg">
                {msg.name}
              </h3>
              <time
                dateTime={msg.createdAt}
                className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400"
              >
                <Calendar size={12} />
                {new Date(msg.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
              {msg.message}
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
