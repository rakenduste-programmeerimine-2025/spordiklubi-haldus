"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { User, Shield } from "lucide-react"

export default function SettingsTabs({ isCoach }: { isCoach: boolean }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get("tab") || "personal"

  const tabs = [
    { key: "personal", label: "Personal", icon: User },
    ...(isCoach ? [{ key: "club", label: "Club", icon: Shield }] : []),
  ]

  const buildHref = (key: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", key)
    const query = params.toString()
    return query ? `${pathname}?${query}` : pathname
  }

  return (
    <nav className="mb-6">
      {/* Compact pill group */}
      <div className="inline-flex rounded-full bg-[#f3f0f4] p-1">
        {tabs.map(tab => {
          const isActive = activeTab === tab.key
          const Icon = tab.icon

          return (
            <div
              key={tab.key}
              className="relative"
            >
              <Link
                href={buildHref(tab.key)}
                aria-current={isActive ? "page" : undefined}
                className="
                  relative flex items-center justify-center gap-2 
                  rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium text-gray-600
                  w-28   /* ensures Personal & Club are same width */
                "
              >
                {isActive && (
                  <motion.div
                    layoutId="settings-tab-pill"
                    className="absolute inset-0 rounded-full bg-white shadow-sm border border-blue-300"
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 30,
                    }}
                  />
                )}

                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span
                    className={isActive ? "text-gray-900" : "text-gray-600"}
                  >
                    {tab.label}
                  </span>
                </span>
              </Link>
            </div>
          )
        })}
      </div>
    </nav>
  )
}
