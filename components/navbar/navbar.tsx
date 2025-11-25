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
      // visible at top, fades out after scrolling down a bit
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
        px-8 py-4
        flex justify-between items-center
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
          className="h-12 w-auto"
        />
        <span className="text-white font-bold text-3xl ml-2">SPORTSYNC</span>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-4">
        <Link href="/auth/login">
          <GlassButton className="px-6 py-2 text-lg">Login</GlassButton>
        </Link>
        <Link href="/auth/sign-up">
          <GlassButton className="px-6 py-2 text-lg">Sign up</GlassButton>
        </Link>
      </div>
    </motion.nav>
  )
}
