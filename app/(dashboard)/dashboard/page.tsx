import { getDashboardStats } from "@/lib/api/dashboardApi"
import { DashboardClient } from "./DashboardClient"

export default async function DashboardPage() {
  const stats = await getDashboardStats(1)

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