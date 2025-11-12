import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { GlassPanel } from "./ui/glasspanel"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="h-screen flex flex-col items-center justify-center text-center snap-start">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/landingpicture.jpg)" }}
      >
        <div className="absolute inset-0 backdrop-blur-sm bg-black/40" />
      </div>
      <div className="items-center justify-center shadow-xl/30 pb-8">
        <img
          src="/images/sportsynclogo.svg"
          alt="Logo"
          className="h-10 w-auto"
        />
        SPORTSYNC
      </div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <GlassPanel>
          <h1 className="text-5xl font-bold mb-4 text-white">
            Manage Your Sports Club Effortlessly
          </h1>

          <p className="text-lg text-white/90 mb-6 max-w-md">
            All-in-one platform to organize teams, schedule matches, and track
            performance.
          </p>

          <Link href="/signup">
            <Button
              size="lg"
              className="border-white border-2"
            >
              Get Started
            </Button>
          </Link>
        </GlassPanel>
      </motion.div>
    </section>
  )
}
