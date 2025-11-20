"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  CalendarDays,
  ClipboardList,
  MessageCircle,
  RotateCcw,
  ChevronDown,
  LogOut,
  Settings,
  Shuffle,
} from "lucide-react"
import { motion } from "framer-motion"

const navItems = [
  { href: "/dashboard", label: "dashboard", icon: Home },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/sportevents", label: "Events", icon: ClipboardList },
  { href: "/forum", label: "Forum", icon: MessageCircle },
]

export function MainNavbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => setMenuOpen(prev => !prev)

  const handleLogout = () => {
    console.log("logout clicked")
  }

  return (
    <header className="w-full shadow-sm">
      {/* Top blue bar */}
      <div className="flex items-center justify-between px-6 py-4 md:py-5 bg-[#2563EB] text-white">
        {/* Left: logo, club name */}
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 rounded-full overflow-hidden bg-white/10">
            <Image
              src="/images/kure.jpg"
              fill
              alt="Club logo"
            />
          </div>
          <div className="leading-tight">
            <p className="font-semibold text-sm sm:text-base md:text-lg">
              FC Kuressaare U10
            </p>
            <p className="text-xs sm:text-sm text-white/80">
              Sports Club Management
            </p>
          </div>
        </div>

        {/* Right: refresh, role, user, dropdown */}
        <div className="relative flex items-center gap-4">
          <button
            type="button"
            className="rounded-full p-2 bg-white/10 hover:bg-white/20 transition"
            aria-label="Refresh"
          >
            <RotateCcw className="h-4 w-4 md:h-5 md:w-5" />
          </button>

          <button
            type="button"
            onClick={toggleMenu}
            className="flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 px-3 py-1.5 transition"
          >
            <span className="rounded-full bg-orange-400 px-3 py-1 text-[10px] sm:text-xs font-semibold">
              coach
            </span>
            <span className="text-sm sm:text-base font-medium">
              Sarah Johnson
            </span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                menuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-[110%] mt-1 w-44 rounded-xl bg-white text-gray-800 shadow-lg border border-gray-100 z-50">
              <ul className="py-1 text-sm">
                <li>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2 hover:bg-gray-50"
                    onClick={() => {
                      console.log("switch team clicked")
                      setMenuOpen(false)
                    }}
                  >
                    <Shuffle className="h-4 w-4" />
                    <span>Switch team</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50"
                    onClick={() => {
                      handleLogout()
                      setMenuOpen(false)
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Bottom nav tabs bar with motion pill */}
      <nav className="w-full bg-[#f3f0f4] px-4 py-2">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-2">
          {navItems.map(item => {
            const Icon = item.icon
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/")

            return (
              <div
                key={item.href}
                className="relative flex-1"
              >
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className="relative flex items-center justify-center gap-2 rounded-full px-3 py-2 text-xs sm:text-sm capitalize transition"
                >
                  {/* Animated background pill */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-white shadow-sm border border-blue-300"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}

                  {/* Content on top of the pill */}
                  <div
                    className={[
                      "relative z-10 flex items-center gap-2",
                      isActive ? "text-gray-900" : "text-gray-600",
                    ].join(" ")}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
