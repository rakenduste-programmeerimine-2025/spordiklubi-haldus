"use client"

import { CalendarDays, BarChart3, Users, ClipboardList } from "lucide-react"
import { GlassPanelStatic } from "./ui/glasspanel-static"

// Base card styling (no white background, gradient is background)
const cardBase =
  "relative overflow-hidden w-80 2xl:w-96 min-h-[260px] 2xl:min-h-[320px] " +
  "rounded-3xl text-center border border-white/20 shadow-2xl " +
  "transform transition-transform duration-150 hover:scale-[1.02] " +
  "flex flex-col items-center justify-start px-6 2xl:px-8 py-8 2xl:py-10"

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative z-10 flex flex-col items-center justify-center py-2 md:py-4 lg:py-6 w-full"
    >
      {/* ⭐ STATIC PANEL (no fade, no blur, loads instantly) */}
      <GlassPanelStatic className="pt-3 h-[100px] 2xl:h-[110px] w-[70vw] max-w-4xl 2xl:max-w-5xl 2xl:-mt-10 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-semibold text-white tracking-tight">
          Powerful Features
        </h2>
      </GlassPanelStatic>

      <div className="mt-10 md:mt-12 flex w-full justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 lg:gap-10 2xl:gap-14 max-w-4xl w-full justify-items-center">
          <FeatureCard
            gradient="from-orange-700/80 via-orange-500/60 to-yellow-400/50"
            Icon={CalendarDays}
            title="Smart Scheduling"
            text="Create training sessions and games effortlessly. Everything updates instantly in your team calendar."
          />

          <FeatureCard
            gradient="from-purple-700/80 via-purple-500/60 to-pink-400/50"
            Icon={ClipboardList}
            title="Event RSVP"
            text="See who’s coming or skipping and plan sessions confidently with live attendance responses."
          />

          <FeatureCard
            gradient="from-blue-700/80 via-blue-500/60 to-sky-400/50"
            Icon={BarChart3}
            title="Performance Dashboard"
            text="Track attendance, engagement, and monthly activity trends - all in one clear dashboard."
          />

          <FeatureCard
            gradient="from-green-700/80 via-green-500/60 to-green-300/50"
            Icon={Users}
            title="Team Communication"
            text="Share announcements, coordinate transportation, and keep your team updated in the forum."
          />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  gradient,
  Icon,
  title,
  text,
}: {
  gradient: string
  Icon: React.ElementType
  title: string
  text: string
}) {
  return (
    <div className={`${cardBase} bg-gradient-to-br ${gradient}`}>
      <Icon className="relative z-10 h-14 w-14 2xl:h-20 2xl:w-20 text-white mb-4 mx-auto" />

      <h3 className="relative z-10 text-2xl 2xl:text-3xl font-semibold text-white mb-2">
        {title}
      </h3>

      <p className="relative z-10 text-white/90 text-sm 2xl:text-base max-w-[250px] 2xl:max-w-[300px] mx-auto">
        {text}
      </p>
    </div>
  )
}
