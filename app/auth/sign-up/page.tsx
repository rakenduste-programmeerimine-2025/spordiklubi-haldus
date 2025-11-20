"use client"

import { SignUpForm } from "@/components/sign-up-form"
import GlassButton from "@/components/ui/backbutton"
import Image from "next/image"

export default function Page() {
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
          onClick={() => history.back()}
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
        <div className="flex flex-col items-center text-center gap-1.4">
          <Image
            src="/images/syncc.png"
            alt="Sportsync Logo"
            width={180}
            height={180}
            className="opacity-100 drop-shadow-[0_6px_14px_rgba(0,0,0,0.5)]"
            priority
          />
          <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight">
            Join SportSync
          </h1>
        </div>

        {/* Sign up form */}
        <div className="w-full flex justify-center -mt-0.5">
          <div className="w-full max-w-[360px]">
            <SignUpForm className="scale-[0.9] origin-top" />
          </div>
        </div>
      </main>
    </div>
  )
}
