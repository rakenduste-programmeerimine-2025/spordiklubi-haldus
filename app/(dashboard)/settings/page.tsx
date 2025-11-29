"use client"

import { useSearchParams } from "next/navigation"
import SettingsTabs from "@/components/settingsTabs"
import PersonalSettings from "./PersonalSettings"
import ClubSettings from "./ClubSettings"

export default function SettingsPage() {
  const isCoach = true
  const searchParams = useSearchParams()

  const tab = searchParams.get("tab") || "personal"
  const clubId = searchParams.get("clubId")

  if (!clubId) {
    return
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <SettingsTabs isCoach={isCoach} />

      {tab === "personal" && <PersonalSettings />}
      {tab === "club" && isCoach && <ClubSettings clubId={clubId} />}
    </div>
  )
}
