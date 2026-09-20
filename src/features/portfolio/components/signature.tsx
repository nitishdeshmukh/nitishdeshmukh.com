"use client"

import {
  motion,
  type Easing,
  type SVGMotionProps,
  type Variants,
} from "motion/react"

import { cn } from "@/lib/utils"
import {
  getSignaturePaths,
  SIGNATURE_VIEWBOX,
  type DotStyle,
} from "@/features/portfolio/data/signature"

// Precise animation timings matching the cursive SVG stroke sequence
const PATH_DURATIONS = [0.23, 1.89, 0.12, 0.12, 0.12, 0.39] as const
const PATH_DELAYS = [0.0, 0.33, 2.32, 2.54, 2.76, 2.98] as const

const PATH_EASINGS: Easing[] = [
  [0.42, 0, 0.58, 1], // Stroke 1: Initial ascending flourish
  [0.35, 0.03, 0.26, 1], // Stroke 2: Complex cursive main body
  [0.4, 0, 0.6, 1], // Stroke 3: Upper diacritic / accent
  [0.4, 0, 0.6, 1], // Stroke 4: Upper dot / accent
  [0.4, 0, 0.6, 1], // Stroke 5: Middle accent mark
  [0.22, 0.05, 0.25, 1], // Stroke 6: Confident sweeping underline flourish
]

const container: Variants = {
  initial: {},
  animate: {},
}

const createDrawVariant = (
  index: number,
  speedMultiplier: number = 1
): Variants => ({
  initial: {
    opacity: 0,
    pathLength: 0,
  },
  animate: {
    opacity: 1,
    pathLength: 1,
    transition: {
      opacity: {
        duration: 0.01,
        delay: PATH_DELAYS[index] / speedMultiplier,
      },
      pathLength: {
        ease: PATH_EASINGS[index],
        duration: PATH_DURATIONS[index] / speedMultiplier,
        delay: PATH_DELAYS[index] / speedMultiplier,
      },
    },
  },
})

export interface SignatureProps extends SVGMotionProps<SVGSVGElement> {
  isScrollTriggered?: boolean
  showGhost?: boolean
  strokeColor?: string
  strokeWidth?: number | string
  speedMultiplier?: number
  dotStyle?: DotStyle
}

export const Signature = ({
  className,
  isScrollTriggered = false,
  showGhost = true,
  strokeColor = "#191712",
  strokeWidth = 2.4,
  speedMultiplier = 1,
  dotStyle = "round",
  ...props
}: SignatureProps) => {
  const paths = getSignaturePaths(dotStyle)

  return (
    <motion.svg
      viewBox={SIGNATURE_VIEWBOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-auto w-full overflow-hidden drop-shadow-sm", className)}
      variants={container}
      initial="initial"
      {...(isScrollTriggered
        ? { whileInView: "animate", viewport: { once: true, amount: 0.3 } }
        : { animate: "animate" })}
      {...props}
    >
      {/* Ghost background paths providing subtle silhouette while drawing */}
      {showGhost &&
        paths.map((path, index) => (
          <motion.path
            key={`ghost-${index}`}
            d={path.d}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.12}
          />
        ))}

      {/* Animated drawing paths */}
      {paths.map((path, index) => (
        <motion.path
          key={`draw-${index}`}
          d={path.d}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          variants={createDrawVariant(index, speedMultiplier)}
        />
      ))}
    </motion.svg>
  )
}

export default Signature
