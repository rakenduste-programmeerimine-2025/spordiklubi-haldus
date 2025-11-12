"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import HeroSection from "@/components/heroSection"
import FeaturesSection from "@/components/featuresSection"
import Navbar from "@/components/navbar/navbar"
import { GlassPanel } from "@/components/ui/glasspanel"
import GlassButton from "@/components/ui/backbutton"

export default function LandingPage() {
  return (
    <main className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <section className="h-screen flex flex-col justify-center items-center text-center snap-start">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <GlassPanel className="pt-5 h-[180px] min-h-0 text-center justify-center items-center">
            <h2 className="text-4xl font-semibold mb-4 text-white">Join Now</h2>
            <GlassButton className="mt-4">Get Started</GlassButton>
          </GlassPanel>
        </motion.div>
      </section>
    </main>
  )
}
