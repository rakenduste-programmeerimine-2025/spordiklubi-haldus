"use client"

import Image from "next/image"
import GlassButton from "@/components/ui/backbutton"
import { ForgotPasswordForm } from "@/components/forgot-password-form"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()

  return (
    <div className="relative min-h-dvh w-full overflow-hidden flex flex-col items-center">
      {/* Background */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/landingpicture.jpg)" }}
      />

      {/* Back button */}
      <div className="fixed top-4 left-4 z-20">
        <GlassButton
          className="text-sm md:text-base"
          onClick={() => router.back()}
        >
          ← Back
        </GlassButton>
      </div>

      {/* Main content */}
      <main
        className="
          w-full max-w-6xl flex flex-col items-center
          pt-8 md:pt-10 lg:pt-12
          gap-8
          -mt-[2vh] md:-mt-[4vh] lg:-mt-[6vh]
        "
      >
        {/* Logo, headings */}
        <div className="flex flex-col items-center text-center gap-1.5">
          <Image
            src="/images/syncc.png"
            alt="Sportsync Logo"
            width={180}
            height={180}
            className="opacity-100 drop-shadow-[0_6px_14px_rgba(0,0,0,0.5)]"
            priority
          />

          <h1 className="text-white text-xl md:text-5xl font-bold leading-tight">
            Forgot your password?
          </h1>

          <p className="text-white/80 mt-1 text-xl">
            Enter your email and we’ll send you a reset link
          </p>
        </div>

        {/* Form */}
        <div className="w-full flex justify-center -mt-0.5">
          <div className="w-full max-w-[560px]">
            <ForgotPasswordForm className="scale-[0.9] origin-top" />
          </div>
        </div>
      </main>
    </div>
  )
}
