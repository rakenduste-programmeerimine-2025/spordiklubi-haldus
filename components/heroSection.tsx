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
      <div className="flex flex-col items-center justify-center pb-10 -mt-4 sm:-mt-6 md:-mt-6 lg:-mt-6 2xl:pb-16 2xl:-mt-12">
        <div className="mb-2">
          <Image
            src="/images/syncc.png"
            alt="SPORTSYNC logo"
            width={150}
            height={150}
            className="h-40 md:h-44 lg:h-48 2xl:h-60 w-auto"
            priority
          />
        </div>
        <h1 className="text-white text-4xl md:text-5xl lg:text-5xl 2xl:text-6xl font-bold tracking-tight -mt-4 2xl:-mt-4">
          SPORTSYNC
        </h1>
      </div>

      {/* FADE-IN CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="2xl:-mt-4"
      >
        <GlassPanel className="px-6 py-6 md:px-8 md:py-6 max-w-xl 2xl:px-12 2xl:py-12 2xl:max-w-3xl">
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-semibold leading-tight mb-6 2xl:max-w-xl mx-auto md:mb-8 2xl:mb-6">
            Manage Your Sports Team <br />
            <span className="font-extrabold">
              Like a <span className="text-[#f4d77c]">Champion</span>
            </span>
          </h1>

          <p className="text-lg md:text-xl 2xl:text-2xl text-white/90 mb-6 md:mb-8 2xl:mb-6 max-w-xl mx-auto">
            All-in-one platform to organize teams, schedule matches, and track
            performance.
          </p>

          <Link href="/auth/sign-up">
            <GlassButton className="px-7 py-3 text-lg md:text-xl 2xl:px-10 2xl:py-4 2xl:text-2xl xl:mt-1">
              Get Started
            </GlassButton>
          </Link>
        </GlassPanel>
      </motion.div>

      {/* SCROLL ARROW (non-flashing) */}
      <motion.div
        initial={false}
        animate={{ opacity: showArrow ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="mt-0 md:mt-1 lg:mt-2 2xl:mt-1 cursor-pointer"
        style={{ pointerEvents: showArrow ? "auto" : "none" }}
        onClick={() => {
          const section = document.getElementById("features")
          if (section) {
            section.scrollIntoView({ behavior: "smooth" })
          }
        }}
      >
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
