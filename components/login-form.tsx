"use client"

import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SignupButton } from "@/components/ui/signupbutton"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { GlassPanel } from "@/components/ui/glasspanel"
export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("inviteToken")
    if (!token) return

    const joinClub = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.user) return

      const res = await fetch(`/api/join/${token}`, { method: "POST" })
      const data = await res.json()
      if (res.ok) {
        localStorage.removeItem("inviteToken")
        router.push(`/${data.clubSlug}/dashboard`)
      }
    }

    joinClub()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data: userData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        })
      if (loginError) throw loginError
      if (!userData.user) throw new Error("No user found")

      const userId = userData.user.id

      // 1️⃣ Set role if selected before email confirmation
      const role = localStorage.getItem("signup_role")
      if (role) {
        const { data: roleRow } = await supabase
          .from("role")
          .select("id")
          .eq("name", role)
          .single()
        if (roleRow) {
          await supabase
            .from("profile")
            .update({ role_id: roleRow.id })
            .eq("id", userId)
        }
        localStorage.removeItem("signup_role")
      }

      // 2️⃣ Add pending club if exists
      const pendingClubId = localStorage.getItem("pendingClubId")
      if (pendingClubId) {
        await supabase
          .from("member")
          .upsert({ profile_id: userId, club_id: pendingClubId })
        localStorage.removeItem("pendingClubId")
      }

      const token = localStorage.getItem("inviteToken")
      if (token) {
        const res = await fetch(`/api/join/${token}`, { method: "POST" })
        const data = await res.json()
        if (res.ok) {
          localStorage.removeItem("inviteToken")
          router.push(`/${data.clubSlug}/dashboard`)
          return
        }
      }

      const { data: memberships, error: membersError } = await supabase
        .from("member")
        .select("club_id")
        .eq("profile_id", userId)

      if (membersError) throw membersError

      if (!memberships || memberships.length === 0) {
        router.push("/auth/join-club")
        return
      }

      if (membersError) throw membersError
      if (!memberships || memberships.length === 0) {
        throw new Error("You are not a member of any club")
      }

      if (memberships.length === 1) {
        const clubId = memberships[0].club_id
        const { data: clubData, error: clubError } = await supabase
          .from("club")
          .select("slug")
          .eq("id", clubId)
          .single()

        if (clubError) throw clubError

        router.push(`/${clubData.slug}/dashboard`)
      } else {
        router.push("/clubs/select")
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={cn("flex flex-col items-center", className)}
      {...props}
    >
      <GlassPanel heading="Log in">
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4"
        >
          {/* Email */}
          <div className="grid gap-2">
            <Label
              htmlFor="email"
              className="text-white/90"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-blue-400"
            />
          </div>

          {/* Password */}
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label
                htmlFor="password"
                className="text-white/90"
              >
                Password
              </Label>
              <Link
                href="/auth/forgot-password"
                className="ml-auto inline-block text-sm text-blue-200 hover:text-blue-100 hover:underline underline-offset-4"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-blue-400"
            />
          </div>

          {/* Error */}
          {error && <p className="text-sm text-red-300">{error}</p>}

          {/* Submit button */}
          <SignupButton
            type="submit"
            label={isLoading ? "Logging in..." : "Sign in"}
            disabled={isLoading}
            className="mt-2"
          />

          {/* Sign-up link */}
          <div className="mt-1 text-center text-sm text-white/80">
            Don’t have an account?{" "}
            <Link
              href="/auth/sign-up"
              className="underline underline-offset-4 text-blue-200 hover:text-blue-100"
            >
              Sign up
            </Link>
          </div>
        </form>
      </GlassPanel>
    </div>
  )
}
