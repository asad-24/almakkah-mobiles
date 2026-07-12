"use client"

import type React from "react"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight,
  BadgeCheck,
  BatteryCharging,
  Camera,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface HeroAction {
  label: string
  href: string
  variant?: "primary" | "secondary" | "ghost"
  icon?: React.ReactNode
}

interface HeroMetric {
  value: string
  label: string
}

interface ElegantHeroProps {
  eyebrow: string
  title: string
  highlight: string
  subtitle: string
  badges?: string[]
  actions?: HeroAction[]
  metrics?: HeroMetric[]
  compact?: boolean
  showVisual?: boolean
}

const defaultActions: HeroAction[] = [
  { label: "Shop Now", href: "/shop", variant: "primary" },
  { label: "View Gallery", href: "/gallery", variant: "secondary" },
  { label: "Contact Us", href: "/contact", variant: "ghost", icon: <MessageCircle className="size-4" /> },
]

const defaultMetrics: HeroMetric[] = [
  { value: "500+", label: "Happy Customers" },
  { value: "100+", label: "Mobile Models" },
  { value: "5+", label: "Years Experience" },
]

export default function ElegantHero({
  eyebrow,
  title,
  highlight,
  subtitle,
  badges = ["Genuine Phones", "Warranty Support", "Best Prices"],
  actions = defaultActions,
  metrics = defaultMetrics,
  compact = false,
  showVisual = true,
}: ElegantHeroProps) {
  return (
    <section
      className={cn(
        "relative z-10 flex items-center overflow-hidden px-4 pb-16 pt-14 sm:px-6 lg:px-8",
        compact ? "min-h-[520px] lg:min-h-[560px]" : "min-h-[calc(100vh-96px)]",
      )}
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className={cn("mx-auto max-w-3xl text-center lg:mx-0 lg:text-left", !showVisual && "lg:col-span-2 lg:text-center")}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/85 shadow-[0_12px_40px_rgba(0,0,0,0.16)] backdrop-blur-md">
            <Sparkles className="size-4 text-sky-300" />
            {eyebrow}
          </div>

          <h1 className="mx-auto max-w-5xl text-balance text-5xl font-black leading-[0.95] tracking-normal text-white sm:text-6xl lg:mx-0 lg:text-7xl xl:text-8xl">
            {title}
            <span className="block bg-linear-to-r from-sky-300 via-blue-300 to-violet-300 bg-clip-text pb-2 text-transparent">
              {highlight}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-8 text-white/78 sm:text-xl lg:mx-0">
            {subtitle}
          </p>

          {badges.length > 0 && (
            <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/20 px-3.5 py-2 text-sm text-white/78 backdrop-blur-sm"
                >
                  <BadgeCheck className="size-4 text-emerald-300" />
                  {badge}
                </span>
              ))}
            </div>
          )}

          {actions.length > 0 && (
            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              {actions.map((action) => (
                <Button
                  key={action.label}
                  asChild
                  size="lg"
                  variant={action.variant === "primary" ? "default" : "outline"}
                  className={cn(
                    "h-12 min-w-[170px] rounded-full px-7 text-base font-semibold",
                    action.variant === "primary" &&
                      "bg-white text-black shadow-[0_20px_60px_rgba(255,255,255,0.22)] hover:bg-white/90",
                    action.variant === "secondary" &&
                      "border-white/35 bg-black/25 text-white backdrop-blur-md hover:bg-white/10 hover:text-white",
                    action.variant === "ghost" &&
                      "border-white/10 bg-white/10 text-white backdrop-blur-md hover:bg-white/15 hover:text-white",
                  )}
                >
                  <Link href={action.href}>
                    {action.icon}
                    {action.label}
                    {action.variant === "primary" && <ArrowRight className="size-4" />}
                  </Link>
                </Button>
              ))}
            </div>
          )}

          {metrics.length > 0 && (
            <div className="mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-3 text-center lg:mx-0">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-4 backdrop-blur-md">
                  <div className="text-2xl font-black text-white sm:text-3xl">{metric.value}</div>
                  <div className="mt-1 text-xs font-medium text-white/58 sm:text-sm">{metric.label}</div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {showVisual && (
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.12, ease: "easeOut" }}
            className="relative mx-auto hidden w-full max-w-md lg:block"
            aria-hidden="true"
          >
            <div className="absolute -inset-8 rounded-[48px] bg-white/10 blur-3xl" />
            <div className="relative rounded-[36px] border border-white/15 bg-white/10 p-5 shadow-[0_32px_100px_rgba(2,6,23,0.55)] backdrop-blur-xl">
              <div className="rounded-[30px] border border-white/10 bg-black/55 p-4">
                <div className="relative mx-auto aspect-[9/16] max-h-[520px] overflow-hidden rounded-[28px] border border-white/15 bg-linear-to-b from-slate-950 via-slate-900 to-black p-5">
                  <div className="mx-auto mb-5 h-1.5 w-20 rounded-full bg-white/20" />
                  <div className="rounded-3xl border border-white/10 bg-white/[0.08] p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-white/50">Today&apos;s pick</p>
                        <p className="mt-1 text-xl font-bold text-white">Premium Mobiles</p>
                      </div>
                      <Smartphone className="size-9 text-sky-300" />
                    </div>
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <FeatureChip icon={<BatteryCharging className="size-4" />} label="Battery" value="Tested" />
                      <FeatureChip icon={<Camera className="size-4" />} label="Camera" value="Clear" />
                      <FeatureChip icon={<ShieldCheck className="size-4" />} label="Warranty" value="Support" />
                      <FeatureChip icon={<MapPin className="size-4" />} label="Faqirwali" value="Local" />
                    </div>
                  </div>
                  <div className="mt-5 rounded-3xl border border-white/10 bg-linear-to-br from-sky-400/20 to-violet-500/20 p-4">
                    <div className="h-32 rounded-2xl bg-[radial-gradient(circle_at_35%_20%,rgba(255,255,255,0.34),transparent_28%),linear-gradient(135deg,rgba(56,189,248,0.38),rgba(139,92,246,0.36))]" />
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/55">New and second-hand</p>
                        <p className="text-lg font-bold text-white">Ready to buy</p>
                      </div>
                      <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                        In stock
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

function FeatureChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
      <div className="mb-2 text-sky-200">{icon}</div>
      <p className="text-xs text-white/45">{label}</p>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  )
}
