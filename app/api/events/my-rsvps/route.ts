// app/api/events/my-rsvps/route.ts
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET /api/events/my-rsvps
// Returns all RSVPs for the current user: [{ event_id, status, note }, ...]
export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("event_rsvp")
    .select("event_id, status, note")
    .eq("profile_id", user.id)

  if (error) {
    console.error("[GET /api/events/my-rsvps] error:", error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data ?? [])
}
