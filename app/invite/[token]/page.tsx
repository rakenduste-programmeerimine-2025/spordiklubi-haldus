"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function InvitePage({ params }: { params: { token: string } }) {
  const router = useRouter()
  const token = params.token

  useEffect(() => {
    localStorage.setItem("inviteToken", token)

    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // logged-in → join immediately
        fetch(`/api/join/${token}`, { method: "POST" })
          .then(res => res.json())
          .then(data => router.push(`/${data.clubSlug}/dashboard`))
      } else {
        router.push("/auth/login")
      }
    })
  }, [router, token])

  return <p>Redirecting…</p>
}
