"use client";

import { motion, AnimatePresence } from "motion/react";
import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Pencil,
  FolderOpen,
  BookOpen,
  CalendarDays,
  Music,
  Mail,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@workspace/ui/lib/utils";

// Brand icons (not in lucide v1+)
function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

interface DockItem {
  href?: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

interface DockIconProps {
  item: DockItem;
  isActive?: boolean;
}

function DockIcon({ item, isActive }: DockIconProps) {
  const [hovered, setHovered] = useState(false);

  const inner = (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={item.onClick}
      className="relative flex flex-col items-center"
      whileTap={{ scale: 0.92 }}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-neutral-900 dark:bg-white px-2 py-1 text-xs font-medium text-white dark:text-neutral-900 shadow-md pointer-events-none"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Icon container */}
      <motion.div
        animate={{ scale: hovered ? 1.3 : 1, y: hovered ? -4 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
          isActive
            ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
            : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
        )}
      >
        {item.icon}
      </motion.div>
    </motion.div>
  );

  if (item.href) {
    return (
      <Link href={item.href} className="outline-none">
        {inner}
      </Link>
    );
  }

  return inner;
}

const NAV_ITEMS: DockItem[] = [
  { href: "/", icon: <House size={18} />, label: "Home" },
  { href: "/blog", icon: <Pencil size={18} />, label: "Blog" },
  { href: "/projects", icon: <FolderOpen size={18} />, label: "Projects" },
  { href: "/guestbook", icon: <BookOpen size={18} />, label: "Guestbook" },
  { href: "/meeting", icon: <CalendarDays size={18} />, label: "Meeting" },
  { href: "/music", icon: <Music size={18} />, label: "Music" },
];

const SOCIAL_ITEMS: DockItem[] = [
  {
    href: "https://github.com/nitishdeshmukh",
    icon: <GithubIcon size={16} />,
    label: "GitHub",
  },
  {
    href: "https://linkedin.com/in/nitish-deshmukh",
    icon: <LinkedinIcon size={16} />,
    label: "LinkedIn",
  },
  {
    href: "mailto:contact@nitishdeshmukh.com",
    icon: <Mail size={16} />,
    label: "Email",
  },
];

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="relative flex flex-col items-center outline-none"
      whileTap={{ scale: 0.92 }}
    >
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-neutral-900 dark:bg-white px-2 py-1 text-xs font-medium text-white dark:text-neutral-900 shadow-md pointer-events-none"
          >
            Toggle theme
          </motion.span>
        )}
      </AnimatePresence>
      <motion.div
        animate={{ scale: hovered ? 1.3 : 1, y: hovered ? -4 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="flex h-9 w-9 items-center justify-center rounded-xl text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
      >
        {resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      </motion.div>
    </motion.button>
  );
}

export function FloatingDock() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 hidden md:block">
      {/* Gradient mask hint - prevents hard cutoff */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
        className="flex items-center gap-1 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 px-3 py-2 shadow-[0_30px_60px_rgba(0,0,0,0.12)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl"
      >
        {/* Nav icons */}
        {NAV_ITEMS.map((item) => (
          <DockIcon
            key={item.href}
            item={item}
            isActive={
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href!)
            }
          />
        ))}

        {/* Divider */}
        <div className="mx-2 h-6 w-px bg-neutral-200 dark:bg-neutral-700" />

        {/* Social icons */}
        {SOCIAL_ITEMS.map((item) => (
          <DockIcon key={item.label} item={item} />
        ))}

        {/* Divider */}
        <div className="mx-2 h-6 w-px bg-neutral-200 dark:bg-neutral-700" />

        {/* Theme toggle */}
        <ThemeToggle />
      </motion.div>
    </div>
  );
}
