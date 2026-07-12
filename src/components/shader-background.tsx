"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"

const MeshGradient = dynamic(
  () => import("@paper-design/shaders-react").then((mod) => mod.MeshGradient),
  {
    ssr: false,
    loading: () => <div className="h-full w-full shader-fallback" />,
  },
)

interface ShaderBackgroundProps {
  children: React.ReactNode
}

export default function ShaderBackground({ children }: ShaderBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updateMotionPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches)
    }

    updateMotionPreference()
    mediaQuery.addEventListener("change", updateMotionPreference)
    return () => {
      mediaQuery.removeEventListener("change", updateMotionPreference)
    }
  }, [])

  return (
    <div ref={containerRef} className="bg-black relative overflow-hidden">
      {/* Background Shaders */}
      <div className="absolute inset-0 h-full w-full shader-fallback">
        {!prefersReducedMotion && (
          <MeshGradient
            className="h-full w-full opacity-90"
            colors={["#020617", "#2563eb", "#8b5cf6", "#0f172a", "#f8fafc"]}
            speed={0.12}
            distortion={0.65}
            swirl={0.18}
            grainOverlay={0.08}
            minPixelRatio={0.65}
            maxPixelCount={650000}
          />
        )}
      </div>

      {children}
    </div>
  )
}
