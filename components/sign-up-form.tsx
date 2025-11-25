"use client"

import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { SignupButton } from "@/components/ui/signupbutton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { GlassPanel } from "@/components/ui/glasspanel"

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
          data: {
            full_name: fullName,
          },
        },
      })
      if (error) throw error
      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full",
        className,
      )}
      {...props}
    >
      <GlassPanel heading="Create your account">
        <form onSubmit={handleSignUp}>
          <div className="flex flex-col gap-4">
            {/* Full Name */}
            <div className="grid gap-1.5">
              <Label
                htmlFor="full-name"
                className="text-white/90 text-base"
              >
                Full Name
              </Label>
              <Input
                id="full-name"
                type="text"
                placeholder="John Doe"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-blue-400"
              />
            </div>

            {/* Email */}
            <div className="grid gap-1.5">
              <Label
                htmlFor="email"
                className="text-white/90 text-base"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-blue-400"
              />
            </div>

            {/* Password */}
            <div className="grid gap-1.5">
              <Label
                htmlFor="password"
                className="text-white/90 text-base"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-blue-400"
              />
            </div>

            {/* Repeat Password */}
            <div className="grid gap-1.5">
              <Label
                htmlFor="repeat-password"
                className="text-white/90 text-base"
              >
                Repeat Password
              </Label>
              <Input
                id="repeat-password"
                type="password"
                required
                value={repeatPassword}
                onChange={e => setRepeatPassword(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-blue-400"
              />
            </div>

            {/* Error */}
            {error && <p className="text-sm text-red-300">{error}</p>}

            {/* Submit button */}
            <SignupButton
              type="submit"
              isLoading={isLoading}
              label="Sign up"
              className="mt-1"
            />
          </div>

          <div className="mt-5 text-center text-sm text-white/80">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="underline underline-offset-4 text-blue-200 hover:text-blue-100"
            >
              Login
            </Link>
          </div>
        </form>
      </GlassPanel>
    </div>
  )
}
