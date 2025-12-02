// lib/api/dashboardApi.ts

import { createClient } from "@/lib/supabase/server"

export async function getDashboardStats(clubId: number) {
  const supabase = createClient()

  return {
    activePlayers: 0,
    activeCoaches: 0,
    trainingSessions: 0,
    leagueGames: 0,
    trainingMonthly: [],
    gameMonthly: [],
  }
}