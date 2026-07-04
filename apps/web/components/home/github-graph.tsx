"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";

interface Contribution {
  date: string;
  count: number;
  level: number; // 0-4
}

interface GithubGraphProps {
  contributions: Contribution[];
  total: number;
}

const LEVEL_COLORS_LIGHT = [
  "#ebedf0", // 0 - empty
  "#9be9a8", // 1 - light
  "#40c463", // 2
  "#30a14e", // 3
  "#216e39", // 4 - dark
];

const LEVEL_COLORS_DARK = [
  "#161b22", // 0 - empty
  "#0e4429", // 1
  "#006d32", // 2
  "#26a641", // 3
  "#39d353", // 4 - bright
];

const CELL = 11; // cell size
const GAP = 2;  // gap between cells
const WEEK_W = CELL + GAP;
const DAY_H = CELL + GAP;

export function GithubGraph({ contributions, total }: GithubGraphProps) {
  const { resolvedTheme } = useTheme();
  const colors = resolvedTheme === "dark" ? LEVEL_COLORS_DARK : LEVEL_COLORS_LIGHT;

  // Group into weeks (columns of 7 days)
  const weeks = useMemo(() => {
    const result: Contribution[][] = [];
    let week: Contribution[] = [];

    // Pad start so first day aligns to correct weekday
    if (contributions.length > 0) {
      const firstDay = new Date(contributions[0]!.date).getDay();
      for (let i = 0; i < firstDay; i++) {
        week.push({ date: "", count: 0, level: -1 }); // placeholder
      }
    }

    for (const c of contributions) {
      week.push(c);
      if (week.length === 7) {
        result.push(week);
        week = [];
      }
    }
    if (week.length > 0) result.push(week);
    return result;
  }, [contributions]);

  const svgWidth = weeks.length * WEEK_W;
  const svgHeight = 7 * DAY_H;

  return (
    <section className="mt-12">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
          GitHub Contributions
        </h2>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {total.toLocaleString()} last year
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm">
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="max-w-full"
        >
          {weeks.map((week, wi) =>
            week.map((day, di) => {
              if (day.level === -1) return null; // placeholder
              return (
                <rect
                  key={`${wi}-${di}`}
                  x={wi * WEEK_W}
                  y={di * DAY_H}
                  width={CELL}
                  height={CELL}
                  rx={2}
                  fill={colors[day.level] ?? colors[0] ?? "#ebedf0"}
                  className="transition-opacity hover:opacity-70"
                >
                  {day.date && (
                    <title>
                      {`${day.count} contribution${day.count !== 1 ? "s" : ""} on ${new Date(day.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}`}
                    </title>
                  )}
                </rect>
              );
            })
          )}
        </svg>
      </div>
    </section>
  );
}
