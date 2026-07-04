"use client";

import { useEffect, useState } from "react";
import { cn } from "@workspace/ui/lib/utils";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Extract headings from DOM since MDX renders them directly
    const elements = Array.from(document.querySelectorAll("h2, h3"));
    const tocItems = elements.map((elem) => ({
      id: elem.id,
      text: elem.textContent ?? "",
      level: Number(elem.tagName.charAt(1)),
    })).filter(item => item.id);

    setItems(tocItems);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" } // trigger when near top
    );

    elements.forEach((elem) => {
      if (elem.id) observer.observe(elem);
    });

    return () => observer.disconnect();
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="sticky top-24 hidden lg:block w-64 flex-shrink-0">
      <h4 className="font-semibold text-sm text-neutral-900 dark:text-white mb-4">
        On this page
      </h4>
      <ul className="space-y-2.5 text-sm">
        {items.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: `${(item.level - 2) * 1}rem` }}
          >
            <a
              href={`#${item.id}`}
              className={cn(
                "block text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors truncate",
                activeId === item.id &&
                  "font-medium text-blue-600 dark:text-blue-400"
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
