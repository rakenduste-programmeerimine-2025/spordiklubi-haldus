"use client"

import { LoginForm } from "@/components/login-form"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()

  return (
    <div className="relative min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-center p-6"
    style={{ backgroundImage: "url('/images/landingpicture.jpg')"}}
    >
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 text-white bg-black/30 hover:bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm transition"
      >
        Back
      </button>
      <div className="text-center mb-10 drop-shadow-lg">
        <h1 className="text-4xl font-semibold text-white">Welcome Back!</h1>
        <p className="text-white/80 mt-2">Log in to your Sportsync account</p>
      </div>
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}
