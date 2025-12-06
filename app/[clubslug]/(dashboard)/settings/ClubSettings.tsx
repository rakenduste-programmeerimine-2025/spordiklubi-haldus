"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { generateSlug } from "@/lib/slug"
import { createClient } from "@/lib/supabase/client"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"

export default function ClubSettings({
  clubslug,
  clubData,
}: {
  clubslug: string
  clubData: { id: string; name: string; club_logo?: string }
}) {
  const [copied, setCopied] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [clubId, setClubId] = useState<string | null>(clubData?.id)
  const [clubName, setClubName] = useState<string | null>(clubData?.name)
  const [clubLogo, setClubLogo] = useState<File | null>(null)
  const [members, setMembers] = useState<any[]>([])
  const textToCopy = token
  const supabase = createClient()

  async function uploadLogo(file: File, clubId: string) {
    const filePath = `club-logos/${clubId}-${Date.now()}`

    const { data, error } = await supabase.storage
      .from("club-logos")
      .upload(filePath, file)

    if (error) {
      console.error("Upload error:", error)
      throw new Error("Failed to upload club logo.")
    }

    const { data: publicUrlData } = supabase.storage
      .from("club-logos")
      .getPublicUrl(filePath)

    return publicUrlData.publicUrl
  }

  const handleSaveClub = async () => {
    if (!clubName || !clubId) {
      alert("Club name is required")
      return
    }

    let logoUrl = clubData.club_logo || null

    if (clubLogo instanceof File && clubId) {
      try {
        logoUrl = await uploadLogo(clubLogo, clubId)
      } catch (err) {
        alert("Failed to upload club logo")
        return
      }
    }

    const res = await fetch("/api/clubs/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clubId,
        name: clubName,
        logoUrl,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      alert("Error: " + data.error)
      return
    }

    const newSlug = generateSlug(clubName)
    redirect(`/${newSlug}/settings`)
  }

  useEffect(() => {
    if (!clubslug) return

    async function fetchMembers() {
      const res = await fetch(`/api/clubs/${clubslug}/members`, {
        method: "GET",
      })
      const data = await res.json()
      if (res.ok) {
        setMembers(data.members)
      } else console.error("Error fetching members:", data.error)
    }

    fetchMembers()
  }, [clubslug])

  useEffect(() => {
    if (!clubId) return
    async function fetchToken() {
      const res = await fetch(`/api/invite/${clubId}`, { method: "GET" })
      const data = await res.json()
      if (data.token) setToken(data.token)
    }
    fetchToken()
  }, [clubId])

  const handleCopy = async () => {
    if (!textToCopy) {
      return
    }
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy!", err)
    }
  }

  async function generateInvite() {
    try {
      const res = await fetch(`/api/invite/${clubId}`, {
        method: "POST",
      })
      const data = await res.json()

      if (data.token) {
        setToken(data.token)
        setCopied(false)
      } else {
        console.error("No token returned", data)
      }
    } catch (err) {
      console.error("Error generating invite:", err)
    }
  }

  const memberStats = {
    total: members.length,
    coaches: members.filter(m => m.profile?.role.name === "coach").length,
    players: members.filter(m => m.profile.role.name === "player").length,
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold">{memberStats.total}</div>
          <div className="text-gray-600 text-sm">Total members</div>
        </div>
        <div className="bg-green-100 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold">{memberStats.players}</div>
          <div className="text-gray-600 text-sm">Players</div>
        </div>
        <div className="bg-orange-100 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold">{memberStats.coaches}</div>
          <div className="text-gray-600 text-sm">Coaches</div>
        </div>
      </div>

      {/* Club Info */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold mb-4">Club Information</h2>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="text-sm text-gray-600">Club name: </label>
            <input
              className="input"
              value={clubName ?? ""}
              onChange={e => setClubName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-600">Club logo: </label>
            <img
              src={
                clubLogo
                  ? URL.createObjectURL(clubLogo)
                  : clubData.club_logo || "/images/syncc.png"
              }
              alt="Club Logo"
              className="h-16 w-16 object-cover rounded"
            />
            <input
              type="file"
              className="w-full text-sm"
              onChange={e => setClubLogo(e.target.files?.[0] ?? null)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-md"
            onClick={handleSaveClub}
          >
            Save club settings
          </button>
        </CardFooter>
      </Card>

      {/* Invite Link */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold mb-4">Invite Team Members</h2>
        </CardHeader>
        <CardContent>
          <div>{token}</div>
          <div className="flex gap-2">
            {token ? (
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                {copied ? "Copied!" : "copy"}
              </button>
            ) : (
              <button
                onClick={generateInvite}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Generate Invite Link
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Members */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold mb-4">Team Members</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {members.map(m => (
              <div
                key={m.id}
                className="flex justify-between bg-gray-100 p-3 rounded-lg"
              >
                <span>
                  {m.profile.name} ({m.profile.role?.name || "Player"})
                </span>
                <button className="text-sm text-gray-600">⋮</button>
              </div>
            ))}
            {members.length === 0 && (
              <p className="text-gray-500">No members yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
