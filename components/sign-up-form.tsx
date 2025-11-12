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
  const [fullName, setFullName] = useState("") // ✅ Added full name
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
            full_name: fullName, // ✅ store in user metadata
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
          <div className="flex flex-col gap-5">
            {/* Full Name */}
            <div className="grid gap-1.5">
              <Label
                htmlFor="full-name"
                className="text-white/90 text-sm"
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
                className="bg-white/10 text-white placeholder:text-blue-100/70 border border-blue-300/40
                 focus:border-blue-300 focus:ring-blue-300 rounded-lg h-10"
              />
            </div>

            {/* Email */}
            <div className="grid gap-1.5">
              <Label
                htmlFor="email"
                className="text-white/90 text-sm"
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
                className="bg-white/10 text-white placeholder:text-blue-100/70 border border-blue-300/40
                 focus:border-blue-300 focus:ring-blue-300 rounded-lg h-10"
              />
            </div>

            {/* Password */}
            <div className="grid gap-1.5">
              <Label
                htmlFor="password"
                className="text-white/90 text-sm"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="bg-white/10 text-white placeholder:text-blue-100/70 border border-blue-300/40
                 focus:border-blue-300 focus:ring-blue-300 rounded-lg h-10"
              />
            </div>

            {/* Repeat Password */}
            <div className="grid gap-1.5">
              <Label
                htmlFor="repeat-password"
                className="text-white/90 text-sm"
              >
                Repeat Password
              </Label>
              <Input
                id="repeat-password"
                type="password"
                required
                value={repeatPassword}
                onChange={e => setRepeatPassword(e.target.value)}
                className="bg-white/10 text-white placeholder:text-blue-100/70 border
                 border-blue-300/40 focus:border-blue-300 focus:ring-blue-300 rounded-lg h-10"
              />
            </div>

            {/* Error */}
            {error && <p className="text-xs text-red-300">{error}</p>}

            {/* Submit button */}
            <SignupButton
              type="submit"
              isLoading={isLoading}
              label="Sign up"
            />
          </div>

          <div className="mt-4 text-center text-base text-blue-100">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="underline underline-offset-4 hover:text-blue-200"
            >
              Login
            </Link>
          </div>
        </form>
      </GlassPanel>
    </div>
  )
}
