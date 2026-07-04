import { Metadata } from "next";
import { SubmitForm } from "@/components/guestbook/submit-form";
import { MessageList } from "@/components/guestbook/message-list";

export const metadata: Metadata = {
  title: "Guestbook | Nitish Deshmukh",
  description: "Leave a message for future visitors. A real-time guestbook built with Next.js, Cloudflare D1, and Pusher.",
};

export default function GuestbookPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-16 pb-24">
      <header className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
          Guestbook
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Leave a mark. Share a thought, a quote, or just say hello. This guestbook updates in real-time.
        </p>
      </header>

      <SubmitForm />
      
      <div className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mb-8">
          Messages
        </h2>
        <MessageList />
      </div>
    </div>
  );
}
