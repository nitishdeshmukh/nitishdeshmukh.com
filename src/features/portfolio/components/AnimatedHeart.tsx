"use client"

import { motion, type SVGMotionProps } from "motion/react"

import { cn } from "@/lib/utils"

interface AnimatedHeartProps extends SVGMotionProps<SVGSVGElement> {
  isScrollTriggered?: boolean
  size?: number
  color?: string
}

export function AnimatedHeart({
  className,
  isScrollTriggered = false,
  size,
  color = "#ff3144",
  ...props
}: AnimatedHeartProps) {
  return (
    <motion.svg
      className={cn("drop-shadow-sm", className)}
      {...(size ? { width: size, height: size } : {})}
      viewBox="0 0 148 148"
      fill="none"
      style={{
        overflow: "visible",
        display: "inline-block",
        verticalAlign: "middle",
      }}
      initial="initial"
      {...(isScrollTriggered
        ? { whileInView: "animate" }
        : { animate: "animate" })}
      {...props}
    >
      {/* Expanding Pulse Ring
      <motion.circle
        cx="74"
        cy="74"
        stroke={color}
        fill="none"
        variants={{
          initial: { r: 0, strokeWidth: 57.6 },
          animate: {
            r: [0, 0, 44.06, 44.06],
            strokeWidth: [57.6, 57.6, 0, 0],
            transition: {
              duration: 0.88,
              repeat: Infinity,
              times: [0, 0.090909, 0.636364, 1],
              ease: ["linear", [0.588, 0, 0.297, 1], "linear"],
            },
          },
        }}
      /> */}

      {/* 8 Animated Particles */}
      <g transform="translate(74, 74) scale(0.25)">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
          <g key={index} style={{ transform: `rotate(${angle}deg)` }}>
            <motion.ellipse
              cx="0"
              fill={color}
              variants={{
                initial: { cy: 0, rx: 0, ry: 0 },
                animate: {
                  cy: [0, 0, 189, 240, 240],
                  rx: [0, 0, 14.5, 0, 0],
                  ry: [0, 0, 14.5, 0, 0],
                  transition: {
                    cy: {
                      duration: 0.88,
                      repeat: Infinity,
                      times: [0, 0.045455, 0.272727, 0.681818, 1],
                      ease: [
                        "linear",
                        [0.6, 0, 0.52, 1],
                        [0.333, 0, 0.38, 1],
                        "linear",
                      ],
                    },
                    rx: {
                      duration: 0.88,
                      repeat: Infinity,
                      times: [0, 0.090909, 0.318182, 0.727273, 1],
                      ease: [
                        "linear",
                        [0.333, 0, 0.667, 1],
                        [0.333, 0, 0.667, 1],
                        "linear",
                      ],
                    },
                    ry: {
                      duration: 0.88,
                      repeat: Infinity,
                      times: [0, 0.090909, 0.318182, 0.727273, 1],
                      ease: [
                        "linear",
                        [0.333, 0, 0.667, 1],
                        [0.333, 0, 0.667, 1],
                        "linear",
                      ],
                    },
                  },
                },
              }}
            />
          </g>
        ))}
      </g>

      {/* Beating Heart */}
      <g transform="translate(74, 74)">
        <motion.path
          d="M11.176,-20.5C6.301,-20.5,2.068,-17.976,0,-14.302C-2.067,-17.976,-6.301,-20.5,-11.175,-20.5C-18.577,-20.5,-23,-14.04,-23,-7.795C-23,6.995,-1.588,19.778,-0.676,20.315C-0.467,20.439,-0.234,20.5,0,20.5C0.234,20.5,0.467,20.439,0.676,20.315C1.588,19.778,23,6.995,23,-7.795C23,-14.04,18.577,-20.5,11.176,-20.5Z"
          fill={color}
          stroke={color}
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            initial: { scale: 1 },
            animate: {
              scale: [1, 0.6, 1.3, 1, 1.05, 1, 1],
              transition: {
                duration: 0.88,
                repeat: Infinity,
                times: [0, 0.090909, 0.318182, 0.5, 0.636364, 0.863636, 1],
                ease: [
                  [0.333, 0.115, 0.48, 1],
                  [0.264, 0, 0.516, 1],
                  [0.373, 0, 0.605, 1],
                  [0.32, 0, 0.663, 0.978],
                  [0.29, 0.002, 0.64, 0.973],
                  "linear",
                ],
              },
            },
          }}
        />
      </g>
    </motion.svg>
  )
}
