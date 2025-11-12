"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import GlassButton from "@/components/ui/backbutton"
import { GlassPanel } from "@/components/ui/glasspanel"
import { UploadCloud } from "lucide-react"
import { SignupButton } from "@/components/ui/signupbutton" //  existing button component

// Constants for file validation, accepts max 5MB and specific formats
const MAX_SIZE_BYTES = 5 * 1024 * 1024
const ACCEPT = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"]

export default function CreateClubPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement | null>(null)

  const [clubName, setClubName] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Guard — only coaches can access
  useEffect(() => {
    const role = sessionStorage.getItem("signup_role")
    if (role !== "coach") router.replace("/auth/sign-up/role")
  }, [router])

  const onFilePick = (f: File | null) => {
    if (!f) return
    if (!ACCEPT.includes(f.type)) {
      setError("Please choose a PNG, JPG or SVG file.")
      setFile(null)
      return
    }
    if (f.size > MAX_SIZE_BYTES) {
      setError("File is too large. Max size is 5MB.")
      setFile(null)
      return
    }
    setError(null)
    setFile(f)
  }

  const handleContinue = async () => {
    if (!clubName.trim()) {
      setError("Please enter a club name.")
      return
    }
    setError(null)
    setLoading(true)

    sessionStorage.setItem("signup_club_name", clubName.trim())

    // TODO: you can call createClub() here later
    setTimeout(() => {
      setLoading(false)
      router.push("/auth/sign-up/done")
    }, 1000)
  }

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
      <main className="w-full max-w-6xl flex flex-col items-center pt-8 md:pt-10 lg:pt-12 gap-3 -mt-[2vh] md:-mt-[4vh] lg:-mt-[6vh]">
        {/* Logo + title */}
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

        {/* Glass Panel */}
        <GlassPanel
          //   withHoverGlow={false} glowing around glass panel
          className="mt-5 w-[85vw] max-w-[560px] min-h-[340px]"
          contentClassName="space-y-5"
          heading={
            <div className="text-left">
              <div className="text-white text-3xl font-semibold">
                Create your club
              </div>
              <div className="text-white/80 text-base mt-1">
                Set up your team information
              </div>
            </div>
          }
        >
          {/* Club name input */}
          <div className="space-y-2">
            <label className="block text-white/90 text-sm">Club name</label>
            <input
              value={clubName}
              onChange={e => setClubName(e.target.value)}
              placeholder="FC Warriors"
              className="w-full bg-white/10 text-white placeholder:text-blue-100/70
               border border-blue-300/40 focus:border-blue-300 focus:ring-blue-300
               rounded-lg h-10 px-3 outline-none transition duration-200"
            />
          </div>

          {/* Club logo upload */}
          <div className="space-y-2">
            <label className="block text-white/90 text-sm">
              Club logo (optional)
            </label>

            <div className="flex items-center gap-3">
              {/* Left icon tile — more glassy now */}
              <div
                className="flex items-center justify-center w-16 h-16 rounded-2xl 
                  bg-gradient-to-br from-blue-700/40 via-blue-600/40 to-blue-400/40
                  border border-blue-300/40 backdrop-blur-[6px]
                  shadow-[inset_0_2px_6px_rgba(59,130,246,.3),0_0_8px_rgba(37,99,235,.4)]"
              >
                <UploadCloud
                  className="w-8 h-8 text-white"
                  aria-hidden="true"
                />
              </div>

              {/* Right file picker (glassy like inputs + button) */}
              <div className="flex-1">
                <label
                  htmlFor="clubLogo"
                  className="inline-flex w-full items-center justify-between gap-3 rounded-lg px-4 py-3
                 bg-white/10 text-white border border-blue-300/40
                 hover:bg-white/15 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-300
                 cursor-pointer transition duration-200 backdrop-blur-[4px]"
                >
                  <span className="truncate text-blue-100/80">
                    {file ? file.name : "Choose file — no file chosen"}
                  </span>
                  <span
                    className="shrink-0 rounded-md px-3 py-1 text-sm font-medium
                   bg-gradient-to-br from-blue-600/80 to-blue-400/70
                   text-white shadow-[0_0_6px_rgba(59,130,246,.5)]
                   hover:shadow-[0_0_12px_rgba(59,130,246,.7)]
                   transition-all duration-300"
                  >
                    Browse
                  </span>
                </label>

                <input
                  id="clubLogo"
                  ref={fileRef}
                  type="file"
                  accept={ACCEPT.join(",")}
                  className="hidden"
                  onChange={e => onFilePick(e.target.files?.[0] ?? null)}
                />

                <p className="mt-1 text-blue-100/70 text-xs">
                  PNG, JPG or SVG. Max 5MB
                </p>
              </div>
            </div>
          </div>

          {error && <p className="text-red-200 text-sm">{error}</p>}

          {/* Buttons */}
          <div className="pt-2 flex flex-col gap-2">
            {/* Using your SignupButton with new label */}
            <SignupButton
              type="button"
              label="Create club"
              disabled={loading}
              onClick={handleContinue}
            >
              {loading ? "Creating…" : "Create club"}
            </SignupButton>
          </div>
        </GlassPanel>
      </main>
    </div>
  )
}
