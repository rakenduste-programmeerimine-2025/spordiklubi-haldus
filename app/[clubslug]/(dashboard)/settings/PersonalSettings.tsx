"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { useState } from "react"

export default function PersonalSettings({ profile }: { profile: any }) {
  const [name, setName] = useState(profile.name)
  const [email, setEmail] = useState(profile.email ?? "")
  const [emailPassword, setEmailPassword] = useState("")
  const [password, setPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const validatePassword = (pw: string) => {
    const errors: string[] = []
    if (pw.length < 8) {
      errors.push("Password must be at least 8 characters long.")
    }
    if (!/[A-Z]/.test(pw)) {
      errors.push("Password must contain at least one uppercase letter.")
    }
    if (!/[0-9]/.test(pw)) {
      errors.push("Password must contain at least one number.")
    }
    if (!/[^A-Za-z0-9]/.test(pw)) {
      errors.push("Password must contain at least one special character.")
    }
    return errors.length > 0 ? errors : null
  }

  async function handleSave() {
    setLoading(true)

    const res = await fetch("/api/settings/update-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })

    setLoading(false)

    if (!res.ok) {
      alert("Failed to update")
      return
    }

    alert("Saved!")
  }

  async function handlePasswordChange(
    current: string,
    next: string,
    confirm: string,
  ) {
    if (next !== confirm) {
      alert("Passwords do not match")
      return
    }

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

  async function handleEmailChange() {
    const res = await fetch("/api/settings/update-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password: emailPassword,
      }),
    })

    if (!res.ok) {
      const { error } = await res.json()
      alert("Error: " + error)
      return
    }

    alert("Email updated! Check your inbox for confirmation.")
  }

  return (
    <div className="space-y-6">
      {/* Profile */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Full name</label>
              <input
                className="input"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <button
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md"
              onClick={handleSave}
              disabled={loading}
            >
              Save Changes
            </button>

            <div>
              <label className="text-sm text-gray-600">Email address</label>
              <input
                className="input"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <label className="text-sm text-gray-600">Confirm with password</label>
        <input
          type="password"
          className="input"
          placeholder="Your password"
          value={emailPassword}
          onChange={e => setEmailPassword(e.target.value)}
        />
        <button
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md"
          onClick={handleEmailChange}
          disabled={loading}
        >
          Update Email
        </button>
      </Card>

      {/* Change password */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="password"
              className="input"
              placeholder="Current password"
              onChange={e => setPassword(e.target.value)}
            />
            <input
              type="password"
              className="input"
              placeholder="New password"
              onChange={e => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              className="input"
              placeholder="Confirm password"
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>
        </CardContent>

        <CardFooter>
          <button
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md"
            onClick={() =>
              handlePasswordChange(password, newPassword, confirmPassword)
            }
            disabled={loading}
          >
            Save password
          </button>
        </CardFooter>
      </Card>
    </div>
  )
}
