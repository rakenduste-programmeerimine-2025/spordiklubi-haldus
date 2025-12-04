"use client"

import { useRouter, useParams, useSearchParams } from "next/navigation"

export default function SettingsTabs({ isCoach }: { isCoach: boolean }) {
  const router = useRouter()
  const params = useParams()
  const clubslug = params?.clubslug
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") || "personal"

  if (!clubslug) return null

  const changeTab = (value: string) => {
    router.push(`/${clubslug}/settings?tab=${value}`)
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
