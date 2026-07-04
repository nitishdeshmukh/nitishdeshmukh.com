"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createGuestbookSchema } from "@workspace/shared";
import { z } from "zod";

type CreateGuestbookInput = z.infer<typeof createGuestbookSchema>;
import { Send, Loader2 } from "lucide-react";

export function SubmitForm() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateGuestbookInput>({
    resolver: zodResolver(createGuestbookSchema),
  });

  const onSubmit = async (data: CreateGuestbookInput) => {
    setError(null);
    setSuccess(false);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
      const res = await fetch(`${apiUrl}/api/guestbook`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to submit message");
      }

      setSuccess(true);
      reset();
      
      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  return (
    <div className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 mb-12 shadow-sm">
      <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
        Sign the Guestbook
      </h2>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
        Leave a message for future visitors. All messages must be approved before they appear.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Name
          </label>
          <input
            {...register("name")}
            id="name"
            type="text"
            placeholder="Your name"
            className="w-full px-4 py-2 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 transition-shadow"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="mt-1.5 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Message
          </label>
          <textarea
            {...register("message")}
            id="message"
            rows={3}
            placeholder="Your message..."
            className="w-full px-4 py-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 transition-shadow resize-none"
            disabled={isSubmitting}
          />
          {errors.message && (
            <p className="mt-1.5 text-sm text-red-500">{errors.message.message}</p>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm">
            Thank you! Your message has been submitted and is pending approval.
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 font-medium rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
          <span>{isSubmitting ? "Submitting..." : "Submit Message"}</span>
        </button>
      </form>
    </div>
  );
}
