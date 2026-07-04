import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Info, AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

// --- Custom Callout Component ---
type CalloutType = "note" | "warning" | "danger" | "success";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}

const calloutStyles = {
  note: "bg-blue-50/50 border-blue-200 text-blue-900 dark:bg-blue-950/20 dark:border-blue-900 dark:text-blue-200",
  warning: "bg-yellow-50/50 border-yellow-200 text-yellow-900 dark:bg-yellow-950/20 dark:border-yellow-900 dark:text-yellow-200",
  danger: "bg-red-50/50 border-red-200 text-red-900 dark:bg-red-950/20 dark:border-red-900 dark:text-red-200",
  success: "bg-green-50/50 border-green-200 text-green-900 dark:bg-green-950/20 dark:border-green-900 dark:text-green-200",
};

const calloutIcons = {
  note: Info,
  warning: AlertTriangle,
  danger: AlertCircle,
  success: CheckCircle,
};

function Callout({ type = "note", title, children }: CalloutProps) {
  const Icon = calloutIcons[type];
  return (
    <div
      className={cn(
        "my-6 flex gap-3 rounded-lg border px-4 py-4",
        calloutStyles[type]
      )}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="min-w-0">
        {title && <div className="font-semibold mb-1">{title}</div>}
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

// --- MDX Component Map ---
export const mdxComponents = {
  h1: (props: any) => (
    <h1 className="mt-10 mb-4 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white" {...props} />
  ),
  h2: (props: any) => (
    <h2
      className="mt-10 mb-4 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white pb-2 border-b border-neutral-200 dark:border-neutral-800"
      {...props}
    />
  ),
  h3: (props: any) => (
    <h3 className="mt-8 mb-4 text-xl font-semibold tracking-tight text-neutral-900 dark:text-white" {...props} />
  ),
  h4: (props: any) => (
    <h4 className="mt-8 mb-4 text-lg font-semibold tracking-tight text-neutral-900 dark:text-white" {...props} />
  ),
  p: (props: any) => (
    <p className="leading-7 [&:not(:first-child)]:mt-6 text-neutral-700 dark:text-neutral-300" {...props} />
  ),
  ul: (props: any) => (
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2 text-neutral-700 dark:text-neutral-300" {...props} />
  ),
  ol: (props: any) => (
    <ol className="my-6 ml-6 list-decimal [&>li]:mt-2 text-neutral-700 dark:text-neutral-300" {...props} />
  ),
  li: (props: any) => <li {...props} />,
  blockquote: (props: any) => (
    <blockquote className="mt-6 border-l-2 border-neutral-300 dark:border-neutral-700 pl-6 italic text-neutral-600 dark:text-neutral-400" {...props} />
  ),
  img: (props: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="rounded-lg border border-neutral-200 dark:border-neutral-800 my-8 mx-auto shadow-sm"
      loading="lazy"
      {...props}
      alt={props.alt || ""}
    />
  ),
  a: ({ href, children, ...props }: any) => {
    const isExternal = href?.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-600 dark:text-blue-400 underline underline-offset-4 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          {...props}
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href || ""}
        className="font-medium text-blue-600 dark:text-blue-400 underline underline-offset-4 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        {...props}
      >
        {children}
      </Link>
    );
  },
  hr: (props: any) => <hr className="my-10 border-neutral-200 dark:border-neutral-800" {...props} />,
  table: (props: any) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full border-collapse border border-neutral-200 dark:border-neutral-800" {...props} />
    </div>
  ),
  tr: (props: any) => (
    <tr className="m-0 border-t border-neutral-200 dark:border-neutral-800 p-0 even:bg-neutral-50 dark:even:bg-neutral-900/50" {...props} />
  ),
  th: (props: any) => (
    <th className="border border-neutral-200 dark:border-neutral-800 px-4 py-2 text-left font-bold text-neutral-900 dark:text-white" {...props} />
  ),
  td: (props: any) => (
    <td className="border border-neutral-200 dark:border-neutral-800 px-4 py-2 text-left text-neutral-700 dark:text-neutral-300" {...props} />
  ),
  code: (props: any) => (
    <code
      className="relative rounded bg-neutral-100 dark:bg-neutral-800 px-[0.3rem] py-[0.2rem] font-mono text-sm text-neutral-900 dark:text-neutral-200"
      {...props}
    />
  ),
  // Custom Callout component available in MDX
  Callout,
};
