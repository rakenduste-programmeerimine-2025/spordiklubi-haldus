import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { randomUUID } from "crypto"


// GET endpoint to get invite token for a club
export async function GET(
  req: NextRequest,
  { params }: { params: { clubId: string } },
) {
  const supabase = await createClient()
  const resolvedParams = await params
  const club_id = parseInt(resolvedParams.clubId)

  const { data: existingInvite_id, error: fetchError } = await supabase
    .from("club")
    .select("club_invite_id")
    .eq("id", club_id)
    .maybeSingle()

  if (fetchError || !existingInvite_id) {
    return NextResponse.json({ inviteLink: null });
  }

  const { data: existingToken, error } = await supabase.from("club_invite").select("token").eq("id", existingInvite_id?.club_invite_id).maybeSingle()

  const inviteLink = existingToken ? `${process.env.NEXT_PUBLIC_URL}/invite/${existingToken.token}`:null

  return NextResponse.json({ inviteLink });
}

// POST endpoint to generate a new invite token for a club
export async function POST(
  req: NextRequest,
  { params }: { params: { clubId: string } },
) {
  const supabase = await createClient()

  const token = randomUUID()

  const resolvedParams = await params
  const club_id = parseInt(resolvedParams.clubId)

  const {data:newInvite, error } = await supabase
    .from("club_invite")
    .insert({ token: token }).select().maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    const { error: updateError } = await supabase
  .from("club")
  .update({ club_invite_id: newInvite.id })
  .eq("id", club_id);

if (updateError) {
  return NextResponse.json({ error: updateError.message }, { status: 400 })
}

  const inviteLink = `${process.env.NEXT_PUBLIC_URL}/invite/${token}`
  return NextResponse.json({ inviteLink })
}
