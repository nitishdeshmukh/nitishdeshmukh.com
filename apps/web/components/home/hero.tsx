"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Globe } from "lucide-react";

interface Role {
  id: number;
  title: string;
  order: number;
}

interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
}

interface HeroProps {
  name: string;
  bio: string;
  profileImage: string;
  location: string;
  roles: Role[];
  socialLinks: SocialLink[];
}

function GithubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const SOCIAL_ICON_MAP: Record<string, React.ReactNode> = {
  github: <GithubIcon />,
  linkedin: <LinkedinIcon />,
  website: <Globe size={15} />,
};

export function Hero({ name, bio, profileImage, location, roles, socialLinks }: HeroProps) {
  const [currentRole, setCurrentRole] = useState(0);

  useEffect(() => {
    if (roles.length === 0) return;
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <section className="flex flex-col items-start gap-6 pt-16 pb-8">
      {/* Avatar + name row */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full ring-2 ring-neutral-200 dark:ring-neutral-700 ring-offset-2 ring-offset-transparent overflow-hidden bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
            {profileImage ? (
              <Image
                src={profileImage}
                alt={name}
                width={64}
                height={64}
                className="object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-neutral-500">
                {name.charAt(0)}
              </span>
            )}
          </div>
          {/* Online indicator */}
          <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-neutral-950" />
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {name}
          </h1>
          {/* Animated role */}
          <div className="h-5 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={roles[currentRole]?.id ?? 0}
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -14, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="text-sm text-neutral-500 dark:text-neutral-400"
              >
                {roles[currentRole]?.title ?? "Developer"}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bio */}
      <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 max-w-lg">
        {bio}
      </p>

      {/* Location + Social links */}
      <div className="flex flex-wrap items-center gap-3">
        {location && (
          <span className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
            <MapPin size={12} />
            {location}
          </span>
        )}
        {socialLinks.map((link) => (
          <Link
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 px-2.5 py-1 text-xs text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            {SOCIAL_ICON_MAP[link.platform.toLowerCase()] ?? <Globe size={15} />}
            {link.platform}
          </Link>
        ))}
      </div>
    </section>
  );
}
