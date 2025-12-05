import { createClient } from "@/lib/supabase/server"
import SettingsPageClient from "./settingsServer"
import { notFound } from "next/navigation"

export default async function SettingsPage({
  params,
}: {
  params: { clubslug: string }
}) {
  const resolvedParams = await params
  const { clubslug } = resolvedParams

  const supabase = await createClient()

  // fetch club by slug
  const { data: club, error: clubError } = await supabase
    .from("club")
    .select("id, slug")
    .eq("slug", clubslug)
    .single()

  if (clubError || !club) {
    console.log("Club not found:", clubslug, clubError)
    notFound()
  }

  // fetch current user's profile + role + memberships
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    notFound()
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profile")
    .select(
      `
      id,
      name,
      role:role_id (name),
      memberships:member (
        club:club_id (
          id,
          slug
        )
      )
    `,
    )
    .eq("id", user.id)
    .single()

  if (profileError || !profileData) {
    console.error("Profile not found:", profileError)
    notFound()
  }

  // normalize role
  const roleArray = Array.isArray(profileData.role)
    ? profileData.role
    : [profileData.role]

  // find membership for the current club
  const membership = profileData.memberships.find(m => {
    const clubVal = Array.isArray(m.club) ? m.club[0] : m.club
    return clubVal?.slug === clubslug
  })

  if (!membership || !membership.club) {
    console.error("No membership for this club")
    notFound()
  }

  const clubRole = roleArray[0]?.name ?? "player" // default to "player" if missing

  return (
    <SettingsPageClient
      clubslug={clubslug}
      isCoach={clubRole === "coach"}
    />
  )
}
