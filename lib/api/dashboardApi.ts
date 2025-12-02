
import { createClient } from "@/lib/supabase/server"

export async function getDashboardStats(clubId: number) {
  const supabase = await createClient()

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

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

  //Training sessions this month
  const { count: trainingSessions } = await supabase
  .from("event")
  .select(
    `
      id,
      event_type:event_type_id ( name )
    `,
    { count: "exact" }
  )
  .eq("club_id", clubId)
  .eq("event_type.name", "training")
  .gte("date", monthStart.toISOString())
  .lte("date", monthEnd.toISOString())

  //League games this month
  const { count: leagueGames } = await supabase
  .from("event")
  .select(
    `
      id,
      event_type:event_type_id ( name )
    `,
    { count: "exact" }
  )
  .eq("club_id", clubId)
  .eq("event_type.name", "match")
  .gte("date", monthStart.toISOString())
  .lte("date", monthEnd.toISOString())

  // Monthly attendance - trainings
  const { data: trainingMonthly } = await supabase.rpc(
    "get_monthly_attendance",
    {
    p_club_id: clubId,
    p_event_type: "training",
    }
  )

  // Monthly attendance - games
  const { data: gameMonthly } = await supabase.rpc(
    "get_monthly_attendance",
    {
      p_club_id: clubId,
      p_event_type: "match",
    }
  )

  return {
    activePlayers: activePlayers ?? 0,
    activeCoaches: activeCoaches ?? 0,
    trainingSessions: trainingSessions ?? 0,
    leagueGames: leagueGames ?? 0,
    trainingMonthly: trainingMonthly ?? [],
    gameMonthly: gameMonthly ?? [],
  }
}
