"use client"

import Image from "next/image"
import Link from "next/link"
import {
  Home,
  CalendarDays,
  ClipboardList,
  MessageCircle,
  ChevronDown,
  LogOut,
  Settings,
  Shuffle,
} from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { LogoutButton } from "../logout-button"
import type { UserProfile, UserRole } from "@/types/profile"

export function MainNavbar({ clubslug }: { clubslug: string }) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  const toggleMenu = () => setMenuOpen(prev => !prev)

  // Load profile from /api/profile, scoped to clubslug
  useEffect(() => {
    const fetchProfile = async () => {
      setProfileLoading(true)
      try {
        const res = await fetch(
          `/api/profile?clubSlug=${encodeURIComponent(clubslug)}`,
        )

        if (!res.ok) {
          console.error(
            "Failed to fetch profile in navbar:",
            res.status,
            await res.text(),
          )
          return
        }

        const data = (await res.json()) as UserProfile
        setProfile(data)
      } catch (err) {
        console.error("Error fetching profile in navbar", err)
      } finally {
        setProfileLoading(false)
      }
    }

    if (clubslug) {
      fetchProfile()
    }
  }, [clubslug])

  const userRole: UserRole = profile?.role ?? null
  const clubName = profile?.club?.name ?? "Your club"
  const clubLogoSrc = profile?.club?.logo ?? "/images/Kuressaare.png"
  const userFullName = profile?.name ?? "User"

  const roleLabel =
    userRole === "coach" ? "coach" : userRole === "player" ? "player" : ""

  const roleBgClass =
    userRole === "coach"
      ? "bg-orange-400"
      : userRole === "player"
        ? "bg-[#16A34A]"
        : "bg-gray-300"

  function getNavItems(clubslug: string) {
    return [
      { href: `/${clubslug}/dashboard`, label: "dashboard", icon: Home },
      { href: `/${clubslug}/calendar`, label: "Calendar", icon: CalendarDays },
      {
        href: `/${clubslug}/sportevents`,
        label: "Events",
        icon: ClipboardList,
      },
      { href: `/${clubslug}/forum`, label: "Forum", icon: MessageCircle },
    ]
  }

  const navItems = getNavItems(clubslug)

  return (
    <header className="w-full shadow-sm">
      {/* Top blue bar */}
      <div className="flex items-center justify-between px-6 py-4 md:py-4 bg-[#2563EB] text-white">
        {/* Left: logo, club name */}
        <div className="flex items-center gap-4">
          {/* Logo (no circle, slightly bigger) */}
          <div className="relative h-16 w-16 overflow-hidden">
            <Image
              src={clubLogoSrc}
              fill
              alt={`${clubName} logo`}
              className="object-contain"
            />
          </div>

          <p className="font-semibold text-sm sm:text-base md:text-2xl leading-tight">
            {clubName}
          </p>
        </div>

        {/* Right: role badge, user name, dropdown */}
        <div className="relative flex items-center gap-4">
          <button
            type="button"
            onClick={toggleMenu}
            className="flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 px-3 py-1.5 transition"
          >
            {/* Role badge */}
            {roleLabel && (
              <span
                className={`rounded-full px-3 py-1 text-[10px] sm:text-xs font-semibold ${roleBgClass}`}
              >
                {roleLabel}
              </span>
            )}

            {/* Full name */}
            <span className="text-sm sm:text-base font-medium whitespace-nowrap">
              {profileLoading ? "Loading..." : userFullName}
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
                    href={`/${clubslug}/settings`}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href={`/${clubslug}/switch-team`}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Shuffle className="h-4 w-4" />
                    <span>Switch team</span>
                  </Link>
                </li>

                <li>
                  <LogoutButton className="flex w-full items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </LogoutButton>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Bottom nav tabs bar */}
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
