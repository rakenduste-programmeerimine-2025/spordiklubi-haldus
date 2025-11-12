"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import GlassButton from "../ui/backbutton"

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/30 backdrop-blur-md px-8 py-4 flex justify-between items-center">
      <div className="flex items-center">
        <img
          src="/images/syncc.png"
          alt="Logo"
          className="h-10 w-auto"
        />
        <span className="text-black font-bold text-xl ml-2">SPORTSYNC</span>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/auth/login">
          <GlassButton>Login</GlassButton>
        </Link>
        <Link href="/auth/sign-up">
          <GlassButton>Get started</GlassButton>
        </Link>
      </div>
    </nav>
  )
}
