"use client"

import { useRouter } from "@bprogress/next/app"
import { useHotkeys } from "react-hotkeys-hook"

import { trackEvent } from "@/lib/events"

export function KeyboardShortcuts() {
  const router = useRouter()

  const navigate = (path: string, keys: string) => {
    trackEvent({
      name: "keyboard_shortcut_navigate",
      properties: { path, keys },
    })
    router.push(path)
  }

  useHotkeys("g>h", () => navigate("/", "g>h"))
  useHotkeys("g>r", () => navigate("/cv", "g>r"))
  useHotkeys("g>b", () => navigate("/blog", "g>b"))
  useHotkeys("g>c", () => navigate("/cal", "g>c"))
  useHotkeys("g>s", () => navigate("/sponsors", "g>s"))
  useHotkeys("g>m", () => navigate("/bookmarks", "g>m"))
  useHotkeys("g>i", () => navigate("/insights", "g>i"))

  return null
}
