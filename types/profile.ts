// /types/profile.ts
export type UserRole = "coach" | "player" | null

export type UserProfile = {
  id: string
  name: string
  email: string
  role: UserRole
  club: {
    id: number
    name: string
    club_logo: string | null
    slug: string
  } | null
}
