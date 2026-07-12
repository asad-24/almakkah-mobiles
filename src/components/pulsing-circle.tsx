"use client"

import { motion, useReducedMotion } from "framer-motion"

export default function PulsingCircle() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="absolute bottom-8 right-8 z-30">
      <div className="relative w-20 h-20 flex items-center justify-center">
        <div className="h-[60px] w-[60px] rounded-full border border-white/40 bg-white/10 shadow-[0_0_32px_rgba(139,92,246,0.45)] pulse-ring" />

        {/* Rotating Text Around the Pulsing Border */}
        <motion.svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          animate={shouldReduceMotion ? undefined : { rotate: -360 }}
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }
          }
          style={{ transform: "scale(1.6)" }}
        >
          <defs>
            <path id="circle" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
          </defs>
          <text className="text-sm fill-white/80 instrument">
            <textPath href="#circle" startOffset="0%">
              Al Makkah Mobile Faqirwali • Best Mobile Shop •Best Quality 
            </textPath>
          </text>
        </motion.svg>
      </div>
    </div>
  )
}
