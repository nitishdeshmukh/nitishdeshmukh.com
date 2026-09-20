"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { SVGMotionProps } from "motion/react"
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"

// Exact 2D Paths for N and D (from nitish-deshmukh-mark.tsx)
const PATH_N =
  "M167.371 166.914L89.7326 47.9226H23.0184V290.469H92.4636V171.152L170.492 290.469H236.816V47.9226H167.371V166.914Z"

const PATH_D =
  "M478.838 169.196C478.838 152.026 475.977 136.052 470.255 121.273C464.533 106.277 455.95 93.4544 444.505 82.805C433.061 71.9382 418.756 63.4621 401.59 57.3767C384.424 51.0739 364.526 47.9226 341.898 47.9226H283.377V290.469H350.481C374.15 290.469 394.177 287.209 410.563 280.689C426.949 274.169 440.214 265.367 450.358 254.283C460.501 243.199 467.784 230.376 472.206 215.815C476.627 201.036 478.838 185.496 478.838 169.196Z"

// Key Construction Guide Intersections
const GUIDE_NODES: [number, number][] = [
  [129.9, 169.2], // N Center
  [381.1, 169.2], // D Center
  [255.5, 169.2], // Mid Pivot
  [23.0, 47.9], // Top-Left N
  [236.8, 47.9], // Top-Right N
  [23.0, 290.5], // Bottom-Left N
  [236.8, 290.5], // Bottom-Right N
  [283.4, 47.9], // Top-Left D
  [283.4, 290.5], // Bottom-Left D
  [478.8, 169.2], // Right Apex D
]

export type NitishDeshmukhMarkInteractiveProps = SVGMotionProps<SVGSVGElement>

export function NitishDeshmukhMarkInteractive({
  className = "",
  ...props
}: NitishDeshmukhMarkInteractiveProps) {
  const id = useId()
  const ids = {
    spotlightMask: `nd-subtle-spotlight-${id}`,
    hatchPattern: `nd-subtle-hatch-${id}`,
    glowFilter: `nd-subtle-glow-${id}`,
  }

  const svgRef = useRef<SVGSVGElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const isInView = useInView(svgRef, { margin: "80px" })
  const [isHovered, setIsHovered] = useState(false)

  // Cursor tracking
  const rawMouseX = useMotionValue(0.5)
  const rawMouseY = useMotionValue(0.5)

  // Smooth springs for spotlight tracking
  const cursorX = useSpring(useTransform(rawMouseX, [0, 1], [0, 512]), {
    stiffness: 280,
    damping: 25,
    mass: 0.1,
  })

  const cursorY = useSpring(useTransform(rawMouseY, [0, 1], [0, 341]), {
    stiffness: 280,
    damping: 25,
    mass: 0.1,
  })

  useEffect(() => {
    if (shouldReduceMotion || !isInView) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!svgRef.current) return
      const rect = svgRef.current.getBoundingClientRect()

      const normX = Math.max(
        0,
        Math.min(1, (e.clientX - rect.left) / rect.width)
      )
      const normY = Math.max(
        0,
        Math.min(1, (e.clientY - rect.top) / rect.height)
      )

      rawMouseX.set(normX)
      rawMouseY.set(normY)
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
    }

    const handleMouseEnter = () => {
      setIsHovered(true)
    }

    const el = svgRef.current
    if (el) {
      el.addEventListener("mousemove", handleMouseMove)
      el.addEventListener("mouseleave", handleMouseLeave)
      el.addEventListener("mouseenter", handleMouseEnter)
    }

    return () => {
      if (el) {
        el.removeEventListener("mousemove", handleMouseMove)
        el.removeEventListener("mouseleave", handleMouseLeave)
        el.removeEventListener("mouseenter", handleMouseEnter)
      }
    }
  }, [isInView, shouldReduceMotion, rawMouseX, rawMouseY])

  return (
    <motion.svg
      ref={svgRef}
      viewBox="0 0 512 341"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`h-auto w-full cursor-pointer touch-manipulation overflow-visible select-none ${className}`}
      {...props}
    >
      <defs>
        {/* Glow Filter */}
        <filter
          id={ids.glowFilter}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Dynamic Cursor Spotlight Gradient */}
        <motion.radialGradient
          id={ids.spotlightMask}
          cx={cursorX}
          cy={cursorY}
          r="200"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            stopColor="currentColor"
            className="text-foreground"
            stopOpacity="0.8"
          />
          <stop
            stopColor="currentColor"
            className="text-foreground/35"
            offset="0.6"
          />
          <stop
            stopColor="currentColor"
            className="text-foreground/0"
            offset="1"
            stopOpacity="0"
          />
        </motion.radialGradient>

        {/* Subtle Blueprint Diagonal Hatch Texture */}
        <pattern
          id={ids.hatchPattern}
          x="0"
          y="0"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M-1 1l2 -2M0 10l10 -10M9 11l2 -2"
            stroke="currentColor"
            strokeWidth="0.75"
            className="text-foreground/15"
          />
        </pattern>
      </defs>

      {/* 1. SACRED BLUEPRINT GUIDELINES */}
      <g
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
        className="text-foreground/20"
      >
        {/* Centerlines */}
        <line x1="0" y1="169.2" x2="512" y2="169.2" strokeDasharray="6 3" />
        <line x1="0" y1="47.9" x2="512" y2="47.9" strokeDasharray="2 4" />
        <line x1="0" y1="290.5" x2="512" y2="290.5" strokeDasharray="2 4" />

        <line x1="129.9" y1="0" x2="129.9" y2="341" strokeDasharray="2 4" />
        <line x1="381.1" y1="0" x2="381.1" y2="341" strokeDasharray="2 4" />
        <line x1="255.5" y1="0" x2="255.5" y2="341" strokeDasharray="6 3" />

        {/* 45-Degree Axis Lines */}
        <line x1="0" y1="39.3" x2="259.8" y2="299.1" strokeDasharray="3 3" />
        <line x1="259.8" y1="39.3" x2="0" y2="299.1" strokeDasharray="3 3" />
        <line x1="251.2" y1="39.3" x2="511" y2="299.1" strokeDasharray="3 3" />
        <line x1="511" y1="39.3" x2="251.2" y2="299.1" strokeDasharray="3 3" />

        {/* Construction Circles */}
        <circle cx="129.9" cy="169.2" r="60" />
        <circle cx="129.9" cy="169.2" r="121.3" />
        <circle cx="23" cy="47.9" r="40" />
        <circle cx="236.8" cy="290.5" r="40" />

        <circle cx="381.1" cy="169.2" r="60" />
        <circle cx="381.1" cy="169.2" r="121.3" />
        <circle cx="283.4" cy="47.9" r="40" />
        <circle cx="283.4" cy="290.5" r="40" />

        {/* Central Vesica Piscis Circle */}
        <circle cx="255.5" cy="169.2" r="121.3" strokeDasharray="4 4" />
      </g>

      {/* 2. ILLUMINATED SPOTLIGHT GUIDELINES (Active on Hover) */}
      <g
        stroke={`url(#${ids.spotlightMask})`}
        strokeWidth="1"
        fill="none"
        opacity={isHovered ? 1 : 0.4}
        className="transition-opacity duration-300"
      >
        <circle cx="129.9" cy="169.2" r="121.3" />
        <circle cx="381.1" cy="169.2" r="121.3" />
        <circle cx="255.5" cy="169.2" r="121.3" />
        <line x1="0" y1="169.2" x2="512" y2="169.2" />
        <line x1="255.5" y1="0" x2="255.5" y2="341" />
      </g>

      {/* 3. ETCHED DIAGRAM HATCH LAYER (Diagonal Lines Only - Zero White Tint Fill) */}
      <g fill={`url(#${ids.hatchPattern})`}>
        <path d={PATH_N} />
        <path d={PATH_D} />
      </g>

      {/* 5. SUBTLE ULTRA-FINE BASE OUTLINE (Reduced default non-hover border) */}
      <g
        stroke="currentColor"
        strokeWidth="1.25"
        fill="none"
        className="stroke-foreground/25 transition-opacity duration-300"
      >
        <path d={PATH_N} />
        <path d={PATH_D} />
      </g>

      {/* 6. DYNAMIC SPOTLIGHT GLOWING CONTOUR OVERLAY (Responsive Hover Glow) */}
      <g
        stroke={`url(#${ids.spotlightMask})`}
        strokeWidth={isHovered ? "1.85" : "1"}
        fill="none"
        filter={`url(#${ids.glowFilter})`}
        opacity={isHovered ? 0.95 : 0.25}
        className="transition-all duration-300"
      >
        <path d={PATH_N} />
        <path d={PATH_D} />
      </g>

      {/* 7. GEOMETRIC ANCHOR NODES */}
      <g className="fill-background stroke-foreground/60" strokeWidth="1">
        {GUIDE_NODES.map(([x, y], idx) => (
          <circle
            key={`node-${idx}`}
            cx={x}
            cy={y}
            r={idx < 3 ? "3.5" : "2.5"}
          />
        ))}
      </g>

      {/* 8. RECTIFIED TARGETING CROSSHAIRS ON HOVER */}
      {isHovered && (
        <g
          fill="none"
          stroke="currentColor"
          className="text-foreground/70"
          strokeWidth="0.75"
        >
          {GUIDE_NODES.map(([x, y], idx) => (
            <g key={`target-${idx}`}>
              <circle cx={x} cy={y} r="6" strokeDasharray="2 2" />
            </g>
          ))}
        </g>
      )}
    </motion.svg>
  )
}
