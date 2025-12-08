"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import GlassButton from "../ui/backbutton"

export default function Navbar() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY < 30)
    }

    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ opacity: 1 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="
        fixed top-0 left-0 w-full z-50
        flex items-center justify-between
        px-4 py-3
        sm:px-6 sm:py-3.5
        lg:px-8 lg:py-4
        xl:px-10 xl:py-5
        2xl:px-12 2xl:py-5
        bg-transparent backdrop-blur-sm
      "
    >
      {/* Logo + text */}
      <div className="flex items-center">
        <Image
          src="/images/syncc.png"
          alt="Logo"
          width={50}
          height={50}
          priority
          className="
            h-9 sm:h-10 md:h-11 lg:h-12
            xl:h-14
            2xl:h-16
            w-auto
          "
        />
        <span
          className="
            text-white font-bold ml-2
            text-xl sm:text-2xl lg:text-3xl
            xl:text-4xl
            2xl:text-5xl
          "
        >
          SPORTSYNC
        </span>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 xl:gap-5 2xl:gap-6">
        <Link href="/auth/login">
          <GlassButton
            className="
              px-4 py-1.5 text-sm
              sm:px-5 sm:py-2 sm:text-base
              lg:px-6 lg:py-2 lg:text-lg
              xl:px-7 xl:py-2.5 xl:text-xl
              2xl:px-8 2xl:py-3 2xl:text-2xl
            "
          >
            Login
          </GlassButton>
        </Link>
        <Link href="/auth/sign-up">
          <GlassButton
            className="
              px-4 py-1.5 text-sm
              sm:px-5 sm:py-2 sm:text-base
              lg:px-6 lg:py-2 lg:text-lg
              xl:px-7 xl:py-2.5 xl:text-xl
              2xl:px-8 2xl:py-3 2xl:text-2xl
            "
          >
            Sign up
          </GlassButton>
        </Link>
      </div>
    </motion.nav>
  )
}
