"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import GlassButton from "@/components/ui/backbutton"
import { GlassPanel } from "@/components/ui/glasspanel"
//import { UploadCloud } from "lucide-react"
import { SignupButton } from "@/components/ui/signupbutton"
import { createClient } from "@/lib/supabase/client"

const MAX_SIZE_BYTES = 5 * 1024 * 1024
const ACCEPT = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"]

export default function CreateClubPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement | null>(null)

  const [clubName, setClubName] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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

  const handleSkip = () => {
    if (confirm("Are you sure you want to continue without creating a club?")) {
      router.push("/auth/sign-up-success")
    }
  }

  const handleContinue = async () => {
    if (!clubName.trim()) {
      setError("Please enter a club name.")
      return
    }
    const supabase = await createClient()
    const clubslug = clubName.trim().toLowerCase().replace(/\s+/g, "-")

    try {
      const { data: newClub, error } = await supabase
        .from("club")
        .insert({
          name: clubName,
          club_logo: file,
          slug: clubslug,
        })
        .select()
      if (error) throw error
      console.log("club created: ", newClub)

      const clubId = newClub[0].id

      localStorage.setItem("pendingClubId", clubId)
    } catch (err) {
      console.error("Failed to create club:", err)
      setError("failed to create a club")
      return
    }

    setLoading(true)
    sessionStorage.setItem("signup_club_name", clubName.trim())

    setTimeout(() => {
      setLoading(false)
      router.push(`/auth/sign-up-success`)
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
      <main
        className="
          w-full max-w-6xl flex flex-col items-center
          pt-8 md:pt-10 lg:pt-12
          gap-8
          -mt-[2vh] md:-mt-[4vh] lg:-mt-[6vh]
        "
      >
        {/* Logo + heading */}
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

          {/* typography aligned to other pages */}
          <p className="text-white/80 mt-1 text-xl md:text-2xl">
            Create your club profile
          </p>
        </div>

        {/* Form Panel */}
        <div className="w-full flex justify-center -mt-0.5">
          <GlassPanel
            className="min-h-0 w-full max-w-[560px]"
            heading={
              <div className="text-left">
                <div className="text-white text-2xl font-semibold">
                  Set up your club
                </div>
              </div>
            }
            contentClassName="flex flex-col gap-4"
          >
            {/* Club name */}
            <div className="space-y-1.5">
              <Label className="block text-white/90 text-base">Club name</Label>

              <input
                value={clubName}
                onChange={e => setClubName(e.target.value)}
                placeholder="FC Warriors"
                className="w-full bg-white/10 text-white text-base placeholder:text-white/50
                  border border-white/20 focus:border-blue-300 focus:ring-blue-400
                  rounded-lg h-10 px-3 outline-none transition"
              />
            </div>

            {/* Logo uploader */}
            <div className="space-y-1">
              <Label className="block text-white/90 text-base">
                Club logo (optional)
              </Label>

              <div className="flex items-center gap-3">
                {/* Icon tile upload icon on left */}
                {/* <div
                  className="flex items-center justify-center w-16 h-16 rounded-2xl
                    bg-gradient-to-br from-blue-700/40 via-blue-600/40 to-blue-400/40
                    border border-blue-300/40 backdrop-blur-[6px] -mt-3"
                >
                  <UploadCloud className="w-8 h-8 text-white" />
                </div> */}

                {/* File picker */}
                <div className="flex-1">
                  <label
                    htmlFor="clubLogo"
                    className="inline-flex w-full items-center justify-between gap-3 rounded-lg px-3 py-1.5
                      bg-white/10 text-white border border-blue-300/40 cursor-pointer
                      hover:bg-white/15 transition duration-200"
                  >
                    <span className="truncate text-white/80 text-base">
                      {file ? file.name : "Choose file - no file chosen"}
                    </span>
                    <span
                      className="shrink-0 px-4 py-2 text-sm font-medium rounded-full
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

                  <p className="mt-1 text-white/70 text-xs">
                    PNG, JPG, or SVG - max 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && <p className="text-red-300 text-sm">{error}</p>}

            {/* Continue */}
            <SignupButton
              type="button"
              label={loading ? "Creating…" : "Create club"}
              disabled={loading}
              onClick={handleContinue}
              className="mt-1"
            />
            <SignupButton
              type="button"
              label="Skip"
              disabled={loading}
              onClick={handleSkip}
              className="mt-2"
            />
          </GlassPanel>
        </div>
      </main>
    </div>
  )
}
