"use client"

import { LoginForm } from "@/components/login-form"
import { useRouter } from "next/navigation"
import Image from "next/image"
import GlassButton from "@/components/ui/backbutton"

export default function Page() {
  const router = useRouter()

  return (
    <div className="relative min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-center p-6"
    style={{ backgroundImage: "url('/images/landingpicture.jpg')"}}
    >
      <div className="absolute top-6 left-6">
        <GlassButton onClick={() => router.push("/") }>← Back</GlassButton>
      </div>
      <div className="absolute top-10 w-full flex justify-center">
        <Image
          src="/images/syncc.png"
          alt="Sportsync logo"
          width={150}
          height={150}
          className="drop-shadow-lg"
          priority
        />
      </div>
      <div className="text-center mt-40 drop-shadow-lg">
        <h1 className="text-4xl font-semibold text-white">Welcome Back!</h1>
        <p className="text-white/80 mt-2">Log in to your Sportsync account</p>
      </div>
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}
