"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { useState } from "react"

export default function PersonalSettings({ profile }: { profile: any }) {
  const [name, setName] = useState(profile.name)
  const [email, setEmail] = useState(profile.email ?? "")
  const [initialEmail] = useState(profile.email ?? "")
  const [emailPassword, setEmailPassword] = useState("")
  const [password, setPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const emailChanged = email !== initialEmail

  const baseBtn =
    "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white bg-[#3156ff] hover:bg-[#2442cc] transition"

  const validatePassword = (pw: string) => {
    const errors: string[] = []
    if (pw.length < 8)
      errors.push("Password must be at least 8 characters long.")
    if (!/[A-Z]/.test(pw))
      errors.push("Password must contain at least one uppercase letter.")
    if (!/[0-9]/.test(pw))
      errors.push("Password must contain at least one number.")
    if (!/[^A-Za-z0-9]/.test(pw))
      errors.push("Password must contain at least one special character.")
    return errors.length ? errors : null
  }

  async function handleSave() {
    try {
      setLoading(true)

      // 1) Always update name
      const profileRes = await fetch("/api/settings/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })

      if (!profileRes.ok) {
        alert("Failed to update profile name")
        setLoading(false)
        return
      }

      // 2) If email changed, also update email (requires password)
      if (emailChanged) {
        if (!emailPassword) {
          alert("Please confirm the email change with your password.")
          setLoading(false)
          return
        }

        const emailRes = await fetch("/api/settings/update-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: emailPassword }),
        })

        if (!emailRes.ok) {
          const { error } = await emailRes.json()
          alert("Email update error: " + error)
          setLoading(false)
          return
        }
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("profile-updated"))
      }

      alert("Saved!")
    } finally {
      setLoading(false)
    }
  }

  async function handlePasswordChange(current: string, next: string) {
    const validationErrors = validatePassword(next)
    if (validationErrors) {
      alert(validationErrors.join("\n"))
      return
    }

    const res = await fetch("/api/settings/update-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current, next }),
    })

    if (!res.ok) {
      const { error } = await res.json()
      alert("Error: " + error)
    } else {
      alert("Password updated!")
    }
  }

  return (
    <div className="space-y-6">
      {/* PROFILE */}
      <Card className="border-none bg-white shadow-sm rounded-3xl">
        <CardHeader className="pb-2">
          <h2 className="text-xl font-semibold">Profile</h2>
          <p className="text-sm text-gray-500">Manage your account details</p>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* FULL NAME (left column) */}
            <div className="flex flex-col gap-1 max-w-sm">
              <label className="text-sm font-medium text-gray-700">
                Full name
              </label>
              <input
                className="w-full rounded-2xl bg-gray-100 px-3 py-1.5 text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            {/* EMAIL + CONFIRM WITH PASSWORD (right column) */}
            <div className="flex flex-col gap-3 max-w-sm">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  className="w-full rounded-2xl bg-gray-100 px-3 py-1.5 text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Confirm with password
                </label>
                <input
                  type="password"
                  className="w-full rounded-2xl bg-gray-100 px-3 py-1.5 text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                  placeholder="Your password"
                  value={emailPassword}
                  onChange={e => setEmailPassword(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  {emailChanged
                    ? "Required because you changed your email address."
                    : "Only needed when changing your email address."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className={baseBtn}
          >
            Save changes
          </button>
        </CardFooter>
      </Card>

      {/* CHANGE PASSWORD */}
      <Card className="border-none bg-white shadow-sm rounded-3xl">
        <CardHeader className="pb-2">
          <h2 className="text-xl font-semibold">Change Password</h2>
          <p className="text-sm text-gray-500">Update your account password</p>
        </CardHeader>

        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Current password */}
            <div className="flex flex-col gap-1 max-w-sm">
              <label className="text-sm font-medium text-gray-700">
                Current password
              </label>
              <input
                type="password"
                className="w-full rounded-2xl bg-gray-100 px-3 py-1.5 text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                placeholder="••••••••"
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {/* New password */}
            <div className="flex flex-col gap-1 max-w-sm">
              <label className="text-sm font-medium text-gray-700">
                New password
              </label>
              <input
                type="password"
                className="w-full rounded-2xl bg-gray-100 px-3 py-1.5 text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                placeholder="••••••••"
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end pt-4">
          <button
            onClick={() => handlePasswordChange(password, newPassword)}
            disabled={loading}
            className={baseBtn}
          >
            Save password
          </button>
        </CardFooter>
      </Card>
    </div>
  )
}
