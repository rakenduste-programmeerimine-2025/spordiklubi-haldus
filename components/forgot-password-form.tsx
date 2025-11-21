"use client"

import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GlassPanel } from "@/components/ui/glasspanel"
import { SignupButton } from "@/components/ui/signupbutton"
import Link from "next/link"
import { useState } from "react"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      })
      if (error) throw error
      setSuccess(true)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <GlassPanel
        heading="Check your email"
        className="min-h-0"
      >
        <p className="text-white/90 text-sm leading-relaxed">
          We’ve sent you a password reset link. Please check your inbox and
          follow the instructions to reset your password.
        </p>

        <div className="mt-4 text-center text-sm text-white/80">
          <Link
            href="/auth/login"
            className="underline underline-offset-4 text-blue-200 hover:text-blue-100"
          >
            Back to login
          </Link>
        </div>
      </GlassPanel>
    )
  }

  return (
    <div
      className={cn("flex flex-col items-center", className)}
      {...props}
    >
      <GlassPanel
        heading="Reset your password"
        className="min-h-0"
      >
        <form
          onSubmit={handleForgotPassword}
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

          {error && <p className="text-sm text-red-300">{error}</p>}

          {/* Submit button */}
          <SignupButton
            type="submit"
            label={isLoading ? "Sending..." : "Send reset link"}
            disabled={isLoading}
            className="mt-1"
          />

          {/* Back to login */}
          <div className="mt-1 text-center text-sm text-white/80">
            Remember your password?{" "}
            <Link
              href="/auth/login"
              className="underline underline-offset-4 text-blue-200 hover:text-blue-100"
            >
              Back to login
            </Link>
          </div>
        </form>
      </GlassPanel>
    </div>
  )
}
