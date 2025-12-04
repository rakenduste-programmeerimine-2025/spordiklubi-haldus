import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

interface Props {
  params: { token: string }
}

export default async function InvitePage({ params }: Props) {
  const supabase = await createClient()
  const resolvedParams = await params
  const { token } = resolvedParams

  const { data: invite, error: inviteError } = await supabase
    .from("club_invite")
    .select("*")
    .eq("token", token)
    .single()

  if (inviteError || !invite) {
    return <p>Invalid invite</p>
  }

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect(`/auth/sign-up?invite=${token}`)
  }

  const userId = session.user.id

  const { data: club, error: clubError } = await supabase
    .from("club")
    .select("id, slug")
    .eq("club_invite_id", invite.id)
    .single()

  if (clubError || !club) {
    return <p>Club not found for this invite</p>
  }

  const { data: profile, error: profileError } = await supabase
    .from("profile")
    .select("id")
    .eq("id", userId)
    .single()

  if (profileError || !profile) {
    return <p>Profile not found</p>
  }

  await supabase.from("Member").insert({
    profile_id: profile.id,
    club_id: club.id,
  })

  redirect(`/${club.slug}/dashboard`)
}
