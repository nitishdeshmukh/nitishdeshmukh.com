"use client"

import { useTheme } from "next-themes"
import { flushSync } from "react-dom"
import { useHotkeys } from "react-hotkeys-hook"

import { META_THEME_COLORS } from "@/config/site"
import { useClickSound } from "@/hooks/soundcn/use-click-sound"
import { useMetaColor } from "@/hooks/use-meta-color"

import { MoonIcon } from "./animated-icons/moon-icon"
import { SunMediumIcon } from "./animated-icons/sun-medium-icon"
import { Button } from "./ui/button"
import { Kbd } from "./ui/kbd"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

export function ThemeToggle() {
  const { resolvedTheme, systemTheme, setTheme } = useTheme()

  const { setMetaColor } = useMetaColor()

  const [click] = useClickSound()

  const switchTheme = () => {
    // Preserve theme change sound
    click()

    const next = resolvedTheme === "dark" ? "light" : "dark"
    const nextThemeValue = next === systemTheme ? "system" : next
    const nextMetaColor =
      resolvedTheme === "dark"
        ? META_THEME_COLORS.light
        : META_THEME_COLORS.dark

    const applyTheme = () => {
      setTheme(nextThemeValue)
      setMetaColor(nextMetaColor)
      document.documentElement.classList.remove("light", "dark")
      document.documentElement.classList.add(next)
      document.documentElement.style.colorScheme = next
    }

    if (
      typeof document === "undefined" ||
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      applyTheme()
      return
    }

    document.startViewTransition(() => {
      flushSync(() => {
        applyTheme()
      })
    })
  }

  useHotkeys("d", () => switchTheme())

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            className="relative touch-manipulation border-none"
            variant="ghost"
            size="icon-sm"
            aria-label="Toggle mode"
            onClick={() => switchTheme()}
          >
            <span
              className="absolute size-12 pointer-fine:hidden"
              aria-hidden
            />
            <MoonIcon className="hidden [html.dark_&]:block" aria-hidden />
            <SunMediumIcon
              className="hidden [html.light_&]:block"
              aria-hidden
            />
          </Button>
        }
      />
      <TooltipContent className="pr-2 pl-3">
        <div className="flex items-center gap-3">
          Toggle mode
          <Kbd>D</Kbd>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
