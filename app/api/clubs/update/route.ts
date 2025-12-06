import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateSlug } from "@/lib/slug"


export async function POST(req: Request) {
  const supabase = await createClient()
  const body = await req.json()
  const { clubId, name, logoUrl } = body

  if (!clubId) {
    return NextResponse.json({ error: "Missing clubId" }, { status: 400 })
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // const { data: membership } = await supabase
  //   .from("member")
  //   .select("role_id")
  //   .eq("club_id", clubId)
  //   .eq("id", user.id)
  //   .single()

  // if (!membership || membership.role_id !== "coach") {
  //   return NextResponse.json({ error: "Not allowed" }, { status: 403 })
  // }

  const slug = generateSlug(name)

  const { error } = await supabase
    .from("club")
  .update({
    name,
    slug,
    ...(logoUrl && { club_logo: logoUrl })
  })
    .eq("id", clubId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
