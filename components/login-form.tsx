"use client"

import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SignupButton } from "@/components/ui/signupbutton"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push("/protected")
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
          // was gap-6
          className="flex flex-col gap-4"
        >
          {/* Email */}
          <div className="grid gap-1.5">
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
          <div className="grid gap-1.5">
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
            className="mt-1"
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
