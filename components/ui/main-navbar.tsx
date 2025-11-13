"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  CalendarDays,
  ClipboardList,
  Settings2,
  MessageCircle,
  RotateCcw,
  ChevronDown,
  LogOut,
  Settings,
  Shuffle,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "dashboard", icon: Home },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/sportevents", label: "Events", icon: ClipboardList },
  { href: "/manage-events", label: "Manage events", icon: Settings2 },
  { href: "/forum", label: "Forum", icon: MessageCircle },
]

export function MainNavbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => setMenuOpen(prev => !prev)

  // TODO: wire these to real logic later
  const handleLogout = () => {
    // e.g. await supabase.auth.signOut()
    console.log("logout clicked")
  }

  return (
    <header className="w-full shadow-sm">
      {/* 🔷 TOP BLUE BAR (taller now) */}
      <div className="flex items-center justify-between px-6 py-4 md:py-5 bg-[#2563EB] text-white">
        {/* Left: logo + club name */}
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 rounded-full overflow-hidden bg-white/10">
            {/* change to your logo path */}
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

        {/* Right: refresh + role + user + dropdown */}
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

          {/* Dropdown menu */}
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

      {/* 🔽 BOTTOM NAV TABS BAR */}
      <nav className="w-full bg-[#f3f0f4] px-4 py-2">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-2">
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2 text-xs sm:text-sm capitalize transition",
                  "hover:bg-white hover:shadow-sm",
                  isActive
                    ? "bg-white shadow-sm text-gray-900 border border-blue-300"
                    : "text-gray-600",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
