import { getDashboardStats } from "@/lib/api/dashboardApi"
import { DashboardClient } from "./DashboardClient"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user }, } = await supabase.auth.getUser()

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