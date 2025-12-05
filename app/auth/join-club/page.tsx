"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SignupButton } from "@/components/ui/signupbutton"
import { createClient } from "@/lib/supabase/client"

export default function JoinClubPage() {
  const [token, setToken] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleJoin = async () => {
    if (!token) return

    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session?.user) {
      setError("You must be logged in")
      return
    }

    const res = await fetch(`/api/join/${token}`, { method: "POST" })
    const data = await res.json()
    if (res.ok) {
      router.push(`/${data.clubSlug}/dashboard`)
    } else {
      setError(data.error || "Invalid invite token")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-6 bg-white/10 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-white">Join a Club</h2>

        <Label
          htmlFor="token"
          className="text-white/90"
        >
          Invite Token
        </Label>
        <Input
          id="token"
          value={token}
          onChange={e => setToken(e.target.value)}
          placeholder="Paste your invite token here"
          className="mt-1 mb-4"
        />

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <SignupButton
          label="Join Club"
          onClick={handleJoin}
        />
      </div>
    </div>
  )
}
