// app/api/events/route.ts
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server" 

// GET /api/events?clubId=123
export async function GET(req: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(req.url)
  const clubId = searchParams.get("clubId")

  if (!clubId) {
    return NextResponse.json(
      { error: "clubId query param is required" },
      { status: 400 },
    )
  }

  const { data, error } = await supabase
    .from("event")
    .select(
      `
      id,
      title,
      description,
      date,
      start_time,
      end_time,
      location,
      event_type_id,
      club_id,
      created_by,
      created_at,
      updated_at
    `,
    )
    .eq("club_id", clubId)
    .order("date", { ascending: true })
    .order("start_time", { ascending: true })

  if (error) {
    console.error("[GET /api/events] error:", error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data ?? [])
}

// POST /api/events
// body: { title, description, date, start_time, end_time?, location, event_type_id, club_id }
export async function POST(req: Request) {
  const supabase = await createClient()
  const body = await req.json()

  const {
    title,
    description,
    date,
    start_time,
    end_time,
    location,
    event_type_id,
    club_id,
  } = body

  if (
    !title ||
    !description ||
    !date ||
    !start_time ||
    !location ||
    !event_type_id ||
    !club_id
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    )
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const createdBy = user.id

  const { data, error } = await supabase
    .from("event")
    .insert({
      title,
      description,
      date,
      start_time,
      end_time,
      location,
      event_type_id,
      club_id,
      created_by: createdBy,
    })
    .select(
      `
      id,
      title,
      description,
      date,
      start_time,
      end_time,
      location,
      event_type_id,
      club_id,
      created_by,
      created_at,
      updated_at
    `,
    )
    .single()

  if (error) {
    console.error("[POST /api/events] error:", error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data, { status: 201 })
}
