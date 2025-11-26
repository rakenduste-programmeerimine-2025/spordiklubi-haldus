"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type GlassPanelStaticProps = {
  className?: string
  children: React.ReactNode
}

export function GlassPanelStatic({
  className,
  children,
}: GlassPanelStaticProps) {
  return (
    <div
      className={cn(
        "relative border-none rounded-3xl w-[75vw] max-w-[560px]",

        // ⭐ Same original gradient colors (NO transparency loss)
        "bg-gradient-to-br from-blue-700/70 via-blue-600/60 to-blue-400/50",

        // ❗ No blur → no loading
        // "backdrop-blur-[10px]",

        // ⭐ Same glow from original
        "ring-2 ring-inset ring-blue-400/60",
        "shadow-[inset_0_2px_6px_rgba(59,130,246,.3),0_0_10px_rgba(37,99,235,.5),0_0_30px_rgba(59,130,246,.4)]",

        className,
      )}
    >
      {/* ⭐ BLUE glass overlay (NOT white) */}
      <div className="absolute inset-0 bg-blue-500/10 rounded-3xl pointer-events-none" />

      {/* ⭐ Subtle darker blue depth shading */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent rounded-3xl pointer-events-none" />

      <div className="relative z-10 px-6 py-4">{children}</div>
    </div>
  )
}
