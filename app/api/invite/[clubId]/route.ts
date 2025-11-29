import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { randomUUID } from "crypto"


// GET endpoint to get invite token for a club
export async function GET(
  req: NextRequest,
  { params }: { params: { clubId: string } },
) {
  const supabase = await createClient()
  const club_id = parseInt(params.clubId)

  const { data: existingToken, error: fetchError } = await supabase
    .from("club_invite")
    .select("token")
    .eq("club_id", club_id)
    .single()

  if (fetchError || !existingToken) {
    return NextResponse.json({ inviteLink: null });
  }

  const inviteLink = `${process.env.NEXT_PUBLIC_URL}/invite/${existingToken.token}`;

  return NextResponse.json({ inviteLink });
}

// POST endpoint to generate a new invite token for a club
export async function POST(
  req: NextRequest,
  { params }: { params: { clubId: string } },
) {
  const supabase = await createClient()

  const token = randomUUID()

  const club_id = await parseInt(params.clubId)

  const { error } = await supabase
    .from("club_invite")
    .insert({ club_id: club_id, token })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  const inviteLink = `${process.env.NEXT_PUBLIC_URL}/invite/${token}`
  return NextResponse.json({ inviteLink })
}
