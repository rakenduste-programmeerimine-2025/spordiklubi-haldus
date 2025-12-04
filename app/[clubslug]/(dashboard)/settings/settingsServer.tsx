"use client"

import SettingsTabs from "@/components/settingsTabs"
import { useSearchParams } from "next/navigation"
import PersonalSettings from "./PersonalSettings"
import ClubSettings from "./ClubSettings"

export default function SettingsPageClient({ clubslug }: { clubslug: string }) {
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") || "personal"
  const isCoach = true

  return (
    <>
      <SettingsTabs isCoach={isCoach} />
      {tab === "personal" && <PersonalSettings />}
      {tab === "club" && isCoach && <ClubSettings clubslug={clubslug} />}
    </>
  )
}
