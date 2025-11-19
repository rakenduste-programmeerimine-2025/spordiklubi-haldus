import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { useState } from "react"

export default function ClubSettings() {
  const [copied, setCopied] = useState(false)
  const textToCopy = "https://teamync.app/join/club"

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy!", err)
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
            <p>https://teamync.app/join/club</p>
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
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
