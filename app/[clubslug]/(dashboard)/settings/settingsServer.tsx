"use client"

import SettingsTabs from "@/components/ui/settingstabs"
import { useSearchParams } from "next/navigation"
import PersonalSettings from "./PersonalSettings"
import ClubSettings from "./ClubSettings"

export default function SettingsPageClient({
  clubslug,
  isCoach,
  profile,
  club,
}: {
  clubslug: string
  isCoach: boolean
  profile: any
  club: { id: string; name: string; slug: string; club_logo?: string }
}) {
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") || "personal"

  return (
    <>
      <SettingsTabs isCoach={isCoach} />
      {tab === "personal" && <PersonalSettings profile={profile} />}
      {tab === "club" && isCoach && (
        <ClubSettings
          clubslug={clubslug}
          clubData={club}
        />
      )}
    </>
  )
}
