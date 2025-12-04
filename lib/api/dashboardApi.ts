import { createClient } from "@/lib/supabase/server"

const ROLE_COACH_ID = 1        // coach
const ROLE_PLAYER_ID = 2       // player

const EVENT_TYPE_TRAINING_ID = 1 // training
const EVENT_TYPE_GAME_ID = 2     // game

export async function getDashboardStats(clubId: number) {
  const supabase = await createClient()

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const monthStartStr = monthStart.toISOString().split("T")[0]
  const monthEndStr = monthEnd.toISOString().split("T")[0]

 
  const { data: clubMembers, error: memberErr } = await supabase
    .from("member")
    .select("profile_id")
    .eq("club_id", clubId)

  if (memberErr) {
    console.error("Error loading club members:", memberErr)
  }

  const memberIds = clubMembers?.map((m) => m.profile_id) ?? []


  const { count: activePlayers } = await supabase
    .from("profile")
    .select("*", { count: "exact", head: true })
    .in("id", memberIds)
    .eq("role_id", ROLE_PLAYER_ID)


  const { count: activeCoaches } = await supabase
    .from("profile")
    .select("*", { count: "exact", head: true })
    .in("id", memberIds)
    .eq("role_id", ROLE_COACH_ID)


  const { count: trainingSessions } = await supabase
    .from("event")
    .select("id", { count: "exact", head: true })
    .eq("club_id", clubId)
    .eq("event_type_id", EVENT_TYPE_TRAINING_ID)
    .gte("date", monthStartStr)
    .lte("date", monthEndStr)


  const { count: leagueGames } = await supabase
    .from("event")
    .select("id", { count: "exact", head: true })
    .eq("club_id", clubId)
    .eq("event_type_id", EVENT_TYPE_GAME_ID)
    .gte("date", monthStartStr)
    .lte("date", monthEndStr)

 
  const { data: trainingMonthly } = await supabase.rpc(
    "get_monthly_attendance",
    {
      p_club_id: clubId,
      p_event_type: "training",
    }
  )


  const { data: gameMonthly } = await supabase.rpc(
    "get_monthly_attendance",
    {
      p_club_id: clubId,
      p_event_type: "game",
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