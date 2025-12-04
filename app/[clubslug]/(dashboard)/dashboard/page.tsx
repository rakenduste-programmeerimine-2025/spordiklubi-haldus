import { getDashboardStats } from "@/lib/api/dashboardApi"
import { DashboardClient } from "./DashboardClient"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

interface Props {
  params: { clubslug: string }
}

export default async function DashboardPage({ params }: Props) {
  const supabase = await createClient()

  const resolvedParams = await params
  const { clubslug } = resolvedParams
  console.log("clubSlug:", clubslug)

  const { data: club, error } = await supabase
    .from("club")
    .select("id")
    .eq("slug", clubslug)
    .single()

  if (error || !club) {
    console.log("Club not found:", clubslug, error)
    notFound()
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 pt-4 pb-6 text-sm text-slate-600">
        You need to be signed in to view your club dashboard.
      </div>
    )
  }

  const { data: membership, error: membershipError } = await supabase
    .from("member")
    .select("club_id")
    .eq("profile_id", user.id)
    .maybeSingle()

  if (membershipError || !membership?.club_id) {
    return (
      <div className="max-w-6xl mx-auto px-4 pt-4 pb-6 text-sm text-slate-600">
        No club membership found for this account.
      </div>
    )
  }

  const clubId = membership.club_id

  const stats = await getDashboardStats(clubId)

  return (
    <DashboardClient
      activePlayers={stats.activePlayers}
      activeCoaches={stats.activeCoaches}
      trainingSessionsThisMonth={stats.trainingSessions}
      leagueGamesThisMonth={stats.leagueGames}
      trainingMonthly={stats.trainingMonthly}
      gameMonthly={stats.gameMonthly}
    />
  )
}
