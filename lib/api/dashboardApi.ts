import { createClient } from "@/lib/supabase/client"

const ROLE_COACH_ID = 1
const ROLE_PLAYER_ID = 2

const EVENT_TRAINING = 1
const EVENT_GAME = 2

export async function getDashboardStats(clubId: number) {
  const supabase = createClient()

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const start = monthStart.toISOString().split("T")[0]
  const end = monthEnd.toISOString().split("T")[0]

  const { data: members } = await supabase
    .from("member")
    .select("profile_id")
    .eq("club_id", clubId)

  const ids = members?.map(m => m.profile_id) ?? []

  const { count: activePlayers } = await supabase
    .from("profile")
    .select("*", { count: "exact", head: true })
    .in("id", ids)
    .eq("role_id", ROLE_PLAYER_ID)

  const { count: activeCoaches } = await supabase
    .from("profile")
    .select("*", { count: "exact", head: true })
    .in("id", ids)
    .eq("role_id", ROLE_COACH_ID)

  const { count: trainingSessions } = await supabase
    .from("event")
    .select("id", { count: "exact", head: true })
    .eq("club_id", clubId)
    .eq("event_type_id", EVENT_TRAINING)
    .gte("date", start)
    .lte("date", end)

  const { count: leagueGames } = await supabase
    .from("event")
    .select("id", { count: "exact", head: true })
    .eq("club_id", clubId)
    .eq("event_type_id", EVENT_GAME)
    .gte("date", start)
    .lte("date", end)

  const { data: trainingMonthly } = await supabase.rpc(
    "get_monthly_attendance",
    { p_club_id: clubId, p_event_type: "training" }
  )

  const { data: gameMonthly } = await supabase.rpc(
    "get_monthly_attendance",
    { p_club_id: clubId, p_event_type: "game" }
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