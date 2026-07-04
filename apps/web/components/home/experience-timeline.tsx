"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@workspace/ui/lib/utils";

interface Experience {
  id: number;
  company: string;
  role: string;
  description: string | null;
  logoUrl: string | null;
  startDate: string;
  endDate: string | null;
  order: number;
}

interface ExperienceTimelineProps {
  experiences: Experience[];
}

function formatDate(dateStr: string) {
  const [year, month] = dateStr.split("-");
  return new Date(Number(year), Number(month) - 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function ExperienceCard({ exp }: { exp: Experience }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex gap-4">
      {/* Timeline dot */}
      <div className="flex flex-col items-center">
        <div className="mt-1 h-2.5 w-2.5 rounded-full bg-neutral-400 dark:bg-neutral-600 ring-2 ring-white dark:ring-neutral-950 flex-shrink-0" />
        <div className="mt-1 flex-1 w-px bg-neutral-200 dark:bg-neutral-800" />
      </div>

      {/* Content */}
      <div className="pb-8 flex-1 min-w-0">
        <div
          className="flex items-start justify-between gap-2 cursor-pointer group"
          onClick={() => setOpen(!open)}
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
              {exp.role}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {exp.company} ·{" "}
              {formatDate(exp.startDate)} — {exp.endDate ? formatDate(exp.endDate) : "Present"}
            </p>
          </div>
          {exp.description && (
            <ChevronDown
              size={14}
              className={cn(
                "text-neutral-400 flex-shrink-0 mt-0.5 transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          )}
        </div>

        <AnimatePresence>
          {open && exp.description && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                {exp.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  if (experiences.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-6">
        Experience
      </h2>
      <div>
        {experiences.map((exp) => (
          <ExperienceCard key={exp.id} exp={exp} />
        ))}
      </div>
    </section>
  );
}
