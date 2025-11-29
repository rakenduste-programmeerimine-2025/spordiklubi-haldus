import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

interface Props {
  params: { token: string }
}

export default async function InvitePage({ params }: Props) {
  const supabase = await createClient()
  const { token } = params

  const { data: invite, error } = await supabase
    .from("Club_invite")
    .select("*")
    .eq("token", token)
    .single()

  if (error || !invite) {
    return <p>Invalid invite</p>
  }

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect(`/auth/sign-up?invite=${token}`)
  }

  const userId = session.user.id

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
    club_id: invite.club_id,
  })

  redirect(`/dashboard/club/${invite.club_id}`)
}
