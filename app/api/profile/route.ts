import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

type RoleName = "coach" | "player"

type RoleRow = {
  name: RoleName
}

type ClubRow = {
  id: number
  name: string
  club_logo: string | null
  slug: string
}

type MemberRow = {
  club: ClubRow | ClubRow[] // we expect at least one
}

type ProfileRow = {
  id: string
  name: string
  email: string
  // Supabase sometimes types relations as arrays even if logically 1:1
  role: RoleRow | RoleRow[]
  memberships: MemberRow[]
}

// GET /api/profile
export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // profile + role + memberships + clubs
  const { data, error } = await supabase
    .from("profile")
    .select(
      `
      id,
      name,
      email,
      role:role_id (
        name
      ),
      memberships:member (
        club:club_id (
          id,
          name,
          club_logo,
          slug
        )
      )
    `,
    )
    .eq("id", user.id)
    .single()

  if (error || !data) {
    console.error("[GET /api/profile] error:", error)
    return NextResponse.json(
      { error: error?.message ?? "Failed to load profile" },
      { status: 400 },
    )
  }

  // Strongly typed, but cast once from Supabase's generic type
  const profile = data as unknown as ProfileRow

  // --- normalize role (always coach|player for this app) ---
  const roleArray = Array.isArray(profile.role)
    ? profile.role
    : [profile.role]

  const firstRole = roleArray[0]
  if (!firstRole?.name) {
    console.error("[GET /api/profile] missing role for profile", profile.id)
    return NextResponse.json(
      { error: "Profile is missing role" },
      { status: 400 },
    )
  }

  const roleName: RoleName = firstRole.name

  // --- normalize membership / active club (must exist for events view) ---
  const firstMembership = profile.memberships?.[0]
  if (!firstMembership || !firstMembership.club) {
    console.error(
      "[GET /api/profile] no membership/club for profile",
      profile.id,
    )
    return NextResponse.json(
      { error: "Profile is not a member of any club" },
      { status: 400 },
    )
  }

  const clubValue = Array.isArray(firstMembership.club)
    ? firstMembership.club[0]
    : firstMembership.club

  if (!clubValue) {
    console.error(
      "[GET /api/profile] membership club empty for profile",
      profile.id,
    )
    return NextResponse.json(
      { error: "Profile has invalid club membership" },
      { status: 400 },
    )
  }

  // logo can be null -> frontend can show default
  return NextResponse.json({
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: roleName, // always "coach" or "player"
    club: {
      id: clubValue.id,
      name: clubValue.name,
      logo: clubValue.club_logo, // can be null -> use default image in UI
      slug: clubValue.slug,
    },
  })
}
