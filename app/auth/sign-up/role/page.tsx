"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import GlassButton from "@/components/ui/backbutton"
import { GlassPanel } from "@/components/ui/glasspanel"
import { cn } from "@/lib/utils"

type Role = "coach" | "player"

export default function RolePage() {
  const router = useRouter()

  const handleSelect = async (role: Role) => {
    sessionStorage.setItem("signup_role", role)
    const supabase = await createClient()
    const { data: roles, error: roleError } = await supabase
      .from("role")
      .select("id")
      .eq("name", role)
      .single()

    if (roleError) {
      console.error(roleError)
      return
    }
    const roleId = roles.id

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (!user) {
      console.error("No logged-in user")
      return
    }

    const { error: updateError, data: updatedProfile } = await supabase
      .from("profile")
      .update({ role_id: roleId })
      .eq("id", user.id)

    if (updateError) {
      console.error(updateError)
      return
    }

    router.push(
      role === "coach" ? "/auth/sign-up/createclub" : "/auth/sign-up-success",
    )
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
        className="w-full max-w-6xl flex flex-col items-center pt-8 md:pt-10 lg:pt-12 gap-3
                   -mt-[2vh] md:-mt-[4vh] lg:-mt-[6vh]"
      >
        {/* Logo */}
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
          <p className="text-white/80 mt-1 text-xl">
            Choose how you’ll use SportSync
          </p>
        </div>

        {/* GlassPanel */}
        <GlassPanel
          //   withHoverGlow={false} glowing around glass panel
          className="mt-5 w-[80vw] max-w-[420px] min-h-[290px]"
          contentClassName="space-y-4"
          heading={
            <div className="text-left">
              <div className="text-white text-2xl font-semibold">
                Select your role
              </div>
            </div>
          }
        >
          <div className="grid gap-4">
            <RoleButton
              label="Player"
              description="View schedules, RSVP to events, and chat with your team"
              palette="green"
              iconSrc="/images/player-icon.png"
              onClick={() => handleSelect("player")}
            />
            <RoleButton
              label="Coach"
              description="Create and manage your club, schedule events, organize your team"
              palette="orange"
              iconSrc="/images/coach-icon.png"
              onClick={() => handleSelect("coach")}
            />
          </div>
        </GlassPanel>
      </main>
    </div>
  )
}

function RoleButton({
  label,
  description,
  palette,
  iconSrc,
  onClick,
}: {
  label: string
  description: string
  palette: "green" | "orange"
  iconSrc: string
  onClick: () => void
}) {
  const base =
    "w-full text-left flex items-center gap-1 pl-1 pr-4 py-3.5 rounded-2xl " +
    "transition-[transform,background,box-shadow] duration-200 shadow-md " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 " +
    "hover:scale-[0.995] active:scale-[0.985]"

  const colors =
    palette === "green"
      ? "bg-gradient-to-r from-emerald-600/90 to-green-500/85 hover:from-emerald-500 hover:to-green-400"
      : "bg-gradient-to-r from-orange-600/90 to-amber-500/85 hover:from-orange-500 hover:to-amber-400"

  return (
    <button
      className={cn(base, colors)}
      onClick={onClick}
      aria-label={label}
    >
      <div className="w-14 h-14 shrink-0 flex items-center justify-start">
        <Image
          src={iconSrc}
          alt={`${label} icon`}
          width={60}
          height={60}
          className="object-contain"
        />
      </div>
      <div className="text-white flex flex-col">
        <span className="font-semibold text-lg leading-tight">{label}</span>
        <span className="text-white/90 text-sm leading-snug">
          {description}
        </span>
      </div>
    </button>
  )
}
