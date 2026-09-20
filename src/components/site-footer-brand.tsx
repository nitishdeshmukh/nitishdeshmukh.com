"use client"

import { FOOTER_BRANDING } from "@/config/site"
import { AnimatedHeart } from "@/features/portfolio/components/AnimatedHeart"

export function SiteFooterBrand() {
  return (
    <div className="screen-line-bottom relative flex flex-col items-center justify-center py-20 text-center after:z-1 after:bg-foreground/15">
      <div className="flex flex-wrap items-center justify-center text-xl font-medium tracking-tight text-muted-foreground/70 sm:text-2xl">
        <span>{FOOTER_BRANDING.tagline}</span>
        <AnimatedHeart className="-mt-1 size-16 sm:size-20" />
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-1/2 hidden h-px w-[50%] max-w-full -translate-x-1/2 dark:block"
        style={{
          background:
            "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(255, 255, 255, 0) 0%, rgba(228, 228, 231, 0.3) 50%, rgba(0, 0, 0, 0) 100%)",
        }}
        aria-hidden
      />
    </div>
  )
}
