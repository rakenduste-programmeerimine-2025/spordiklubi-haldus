"use client"

import SettingsTabs from "@/components/settingsTabs"
import { useSearchParams } from "next/navigation"
import PersonalSettings from "./PersonalSettings"
import ClubSettings from "./ClubSettings"

export default function SettingsPageClient({
  clubslug,
  isCoach,
}: {
  clubslug: string
  isCoach: boolean
}) {
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") || "personal"

  return (
    <>
      <SettingsTabs isCoach={isCoach} />
      {tab === "personal" && <PersonalSettings />}
      {tab === "club" && isCoach && <ClubSettings clubslug={clubslug} />}
    </>
  )
}
