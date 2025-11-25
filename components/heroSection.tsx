"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { GlassPanel } from "./ui/glasspanel"
import Link from "next/link"
import GlassButton from "./ui/backbutton"
import React from "react"

// ➤ Memoized SVG arrow to STOP re-renders
const ArrowSVG = React.memo(() => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="white"
    className="w-10 h-10"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 9l-7 7-7-7"
    />
  </svg>
))
ArrowSVG.displayName = "ArrowSVG"

export default function HeroSection() {
  const [showArrow, setShowArrow] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setShowArrow(window.scrollY < 30)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="flex flex-col items-center justify-center text-center px-4">
      {/* LOGO + TITLE */}
      <div className="flex flex-col items-center justify-center pb-10 -mt-8">
        <div className="mb-2">
          <Image
            src="/images/syncc.png"
            alt="SPORTSYNC logo"
            width={240}
            height={240}
            className="h-60 w-auto"
            priority
          />
        </div>
        <h1 className="text-white text-5xl font-bold tracking-tight">
          SPORTSYNC
        </h1>
      </div>

      {/* FADE-IN CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <GlassPanel className="px-6 py-6 max-w-xl">
          <h1 className="text-white text-5xl md:text-5xl font-semibold leading-tight mb-8">
            Manage Your Sports Team <br />
            <span className="font-extrabold">
              Like a <span className="text-[#f4d77c]">Champion</span>
            </span>
          </h1>

          <p className="text-xl text-white/90 mb-8 max-w-md mx-auto">
            All-in-one platform to organize teams, schedule matches, and track
            performance.
          </p>

          <Link href="/auth/sign-up">
            <GlassButton className="px-8 py-3 text-xl">Get Started</GlassButton>
          </Link>
        </GlassPanel>
      </motion.div>

      {/* SCROLL ARROW (non-flashing) */}
      <motion.div
        initial={false}
        animate={{ opacity: showArrow ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="mt-8 cursor-pointer"
        style={{ pointerEvents: showArrow ? "auto" : "none" }}
        onClick={() => {
          const section = document.getElementById("features")
          if (section) {
            section.scrollIntoView({ behavior: "smooth" })
          }
        }}
      >
        {/* Separate bouncing element that never re-renders */}
        <motion.div
          initial={false}
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ArrowSVG />
        </motion.div>
      </motion.div>
    </section>
  )
}
