"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SignupButton } from "@/components/ui/signupbutton"
import { createClient } from "@/lib/supabase/client"
import { GlassPanel } from "@/components/ui/glasspanel"

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
    <div className="flex min-h-screen items-center justify-center p-4">
      <GlassPanel
        heading="Join a Club"
        headerClassName="pb-1"
        contentClassName="pt-2"
      >
        <div className="space-y-4">
          <div className="space-y-1">
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
              className="
                mt-1
                bg-white/10
                border border-white/20
                text-white
                placeholder:text-white/50
                focus-visible:ring-0
                focus-visible:border-black/40
                backdrop-blur-sm
              "
            />
          </div>

          {error && <p className="text-red-200 text-sm">{error}</p>}

          <div className="mt-4 flex justify-center">
            <SignupButton
              label="Join Club"
              onClick={handleJoin}
            />
          </div>
        </div>
      </GlassPanel>
    </div>
  )
}
