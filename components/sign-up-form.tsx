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
import { PasswordInfo } from "./password-info"

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [error, setError] = useState<string[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

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

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)
    const allErrors: string[] = []

    if (password !== repeatPassword) {
      allErrors.push("Passwords do not match")
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      allErrors.push(...passwordError)
    }

    if (allErrors.length > 0) {
      setError(allErrors)
      setIsLoading(false)
      return
    }

    try {
      const { data: user, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/sign-up/role`,
          data: {
            full_name: fullName,
          },
        },
      })
      if (error) throw error
      if (user) {
        const { error: profileError } = await supabase.from("profile").insert({
          id: user.user?.id,
          email: user.user?.email,
          name: fullName,
          role_id: 3,
        })

        if (profileError) throw profileError
      }
      //sign-up-success
      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? [error.message] : ["An error occurred"])
      console.log(error)
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
              <div className="flex">
                <Label
                  htmlFor="password"
                  className="text-white/90 text-base"
                >
                  Password
                </Label>
                <PasswordInfo />
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
            {error &&
              error.map((error, i) => (
                <p
                  key={i}
                  className="text-sm text-red-300"
                >
                  {error}
                </p>
              ))}

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
