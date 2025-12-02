// lib/api/dashboardApi.ts

import { createClient } from "@/lib/supabase/server"

export async function getDashboardStats(clubId: number) {
  const supabase = await createClient()

  //Active players
  const { count: activePlayers } = await supabase
    .from("member")
    .select("*", { count: "exact", head: true })
    .eq("club_id", clubId)
  
  //Active coaches
  const { count: activeCoaches } = await supabase
    .from("member")
    .select(
      `
        profile:profile_id (
          role_id,
          role:role_id ( name )
        )
      `,
      { count: "exact" }
    )
    .eq("club_id", clubId)
    .eq("profile.role.name", "coach")
  return {
    activePlayers: activePlayers ?? 0,
    activeCoaches: activeCoaches ?? 0,
    trainingSessions: 0,
    leagueGames: 0,
    trainingMonthly: [],
    gameMonthly: [],
  }
}
