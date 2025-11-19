"use client"

import { useRouter, useSearchParams } from "next/navigation"

export default function SettingsTabs({ isCoach }: { isCoach: boolean }) {
  const router = useRouter()
  const params = useSearchParams()
  const tab = params.get("tab") || "personal"

  const changeTab = (value: string) => {
    router.push(`/settings?tab=${value}`)
  }

  return (
    <div className="flex gap-2 mb-6 border-b pb-2">
      <button
        onClick={() => changeTab("personal")}
        className={`px-4 py-2 rounded-md ${
          tab === "personal" ? "bg-blue-600 text-white" : "bg-gray-200"
        }`}
      >
        Personal
      </button>

      {isCoach && (
        <button
          onClick={() => changeTab("club")}
          className={`px-4 py-2 rounded-md ${
            tab === "club" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Club
        </button>
      )}
    </div>
  )
}
