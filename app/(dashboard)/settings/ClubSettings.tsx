import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { useEffect, useState } from "react"

export default function ClubSettings({ clubId }: { clubId: string }) {
  const [copied, setCopied] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const textToCopy = token

  useEffect(() => {
    async function fetchToken() {
      const res = await fetch(`lib/api/invite/${clubId}`, { method: "GET" })
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
      setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy!", err)
    }
  }

  async function generateInvite() {
    const res = await fetch(`/api/invite/${clubId}`, {
      method: "POST",
    })

    const data = await res.json()

    if (data.inviteLink) {
      setToken(data.inviteLink)
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold">16</div>
          <div className="text-gray-600 text-sm">Total members</div>
        </div>
        <div className="bg-green-100 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold">15</div>
          <div className="text-gray-600 text-sm">Players</div>
        </div>
        <div className="bg-orange-100 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold">1</div>
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
              defaultValue="FC Kuressaare U10"
            />
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-600">Club logo: </label>
            <input
              type="file"
              className="w-full text-sm"
            />
          </div>
        </CardContent>
        <CardFooter>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md">
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
          <div className="flex gap-2">
            {token ? (
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                {copied ? "Copied!" : "Copy"}
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
            <div className="flex justify-between bg-gray-100 p-3 rounded-lg">
              <span>Michael Chen (Player)</span>
              <button className="text-sm text-gray-600">⋮</button>
            </div>
            <div className="flex justify-between bg-gray-100 p-3 rounded-lg">
              <span>Jake Upstate (Player)</span>
              <button className="text-sm text-gray-600">⋮</button>
            </div>
            <div className="flex justify-between bg-gray-100 p-3 rounded-lg">
              <span>Sarah Johnson (Coach)</span>
              <button className="text-sm text-gray-600">⋮</button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
