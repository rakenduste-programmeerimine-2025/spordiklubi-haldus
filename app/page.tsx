"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import HeroSection from "@/components/heroSection"
import FeaturesSection from "@/components/featuresSection"
import Navbar from "@/components/navbar/navbar"

// Fade in when entering viewport
const fadeInOut = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen text-white">
      {/* Background image behind everything */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <Image
          src="/images/landingpicture.jpg"
          alt="Sports background"
          fill
          priority
          className="object-cover"
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pt-10 md:pt-12 pb-10 space-y-10 md:space-y-14">
        {/* HERO */}
        <section className="flex items-center justify-center py-8 md:py-10 lg:py-12">
          <HeroSection />
        </section>

        {/* FEATURES */}
        <motion.section
          variants={fadeInOut}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.4 }}
          className="flex items-center justify-center"
        >
          <FeaturesSection />
        </motion.section>
      </main>
    </div>
  )
}
