"use client"

import { motion } from "framer-motion"
import { CalendarDays, BarChart3, Users, ClipboardList } from "lucide-react"
import { GlassPanel } from "./ui/glasspanel"

const easeInOutCurve = [0.42, 0, 0.58, 1] as [number, number, number, number]

const idleFloat = {
  animate: {
    y: [0, -6, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: easeInOutCurve,
    },
  },
}

const cardBase =
  "w-80 min-h-[260px] px-6 py-8 rounded-3xl flex flex-col items-center justify-start text-center " +
  "border border-white/20 shadow-2xl backdrop-blur-2xl bg-white/10 transition-all"

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative z-10 flex flex-col items-center justify-center py-2 md:py-4 lg:py-6 w-full"
    >
      <GlassPanel className="pt-3 h-[100px] w-[70vw] max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white tracking-tight">
          Powerful Features
        </h2>
      </GlassPanel>

      <div className="mt-10 md:mt-12 flex w-full justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 lg:gap-10 max-w-4xl w-full justify-items-center">
          <FeatureCard
            gradient="from-orange-700/60 via-orange-500/40 to-yellow-400/30"
            Icon={CalendarDays}
            title="Smart Scheduling"
            text="Create training sessions and games effortlessly. Everything updates instantly in your team calendar."
          />
          <FeatureCard
            gradient="from-purple-700/60 via-purple-500/40 to-pink-400/30"
            Icon={ClipboardList}
            title="Event RSVP"
            text="See who’s coming or skipping and plan sessions confidently with live attendance responses."
          />
          <FeatureCard
            gradient="from-blue-700/60 via-blue-500/40 to-sky-400/30"
            Icon={BarChart3}
            title="Performance Dashboard"
            text="Track attendance, engagement, and monthly activity trends - all in one clear dashboard."
          />
          <FeatureCard
            gradient="from-green-700/60 via-green-500/40 to-green-300/30"
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
    <motion.div
      whileHover={{ scale: 1.05, rotate: 0.4 }}
      transition={{ type: "spring", stiffness: 140 }}
      {...idleFloat}
    >
      <div className={`${cardBase} bg-gradient-to-br ${gradient}`}>
        <Icon className="h-14 w-14 text-white mb-4" />
        <h3 className="text-2xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-white/80 text-sm max-w-[250px]">{text}</p>
      </div>
    </motion.div>
  )
}
