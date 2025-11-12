"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface GlassPanelProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Card>, "title"> {
  /** Heading displayed at the top (optional) */
  heading?: React.ReactNode
  /** Additional classes for header and content */
  headerClassName?: string
  contentClassName?: string
  /** Enables or disables the blue hover glow */
  withHoverGlow?: boolean
}

export function GlassPanel({
  heading,
  className,
  headerClassName,
  contentClassName,
  withHoverGlow = true,
  children,
  ...props
}: GlassPanelProps) {
  return (
    <Card
      className={cn(
        "relative border-none rounded-3xl w-[75vw] max-w-[560px] min-h-[320px]",
        "bg-gradient-to-br from-blue-700/70 via-blue-600/60 to-blue-400/50",
        "backdrop-blur-[10px]",
        "ring-2 ring-inset ring-blue-400/60",
        "shadow-[inset_0_2px_6px_rgba(59,130,246,.3),0_0_10px_rgba(37,99,235,.5),0_0_30px_rgba(59,130,246,.4)]",
        withHoverGlow &&
          "transition duration-300 ease-[cubic-bezier(.25,1,.5,1)] hover:shadow-[inset_0_2px_8px_rgba(59,130,246,.35),0_0_22px_rgba(59,130,246,.7),0_0_50px_rgba(59,130,246,.6)]",
        className,
      )}
      {...props}
    >
      {heading && (
        <CardHeader className={cn("pb-4 text-left", headerClassName)}>
          <CardTitle className="text-2xl text-white">{heading}</CardTitle>
        </CardHeader>
      )}

      <CardContent className={cn("px-6 py-4", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  )
}
