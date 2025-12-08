"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface GlassPanelSmallProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Card>, "title"> {
  heading?: React.ReactNode
  headerClassName?: string
  contentClassName?: string
  withHoverGlow?: boolean
}

export function GlassPanelSmall({
  heading,
  className,
  headerClassName,
  contentClassName,
  withHoverGlow = false,
  children,
  ...props
}: GlassPanelSmallProps) {
  return (
    <Card
      className={cn(
        "relative border-none rounded-3xl max-w-sm w-full",
        "bg-gradient-to-br from-blue-700/70 via-blue-600/60 to-blue-400/50",
        "backdrop-blur-[10px]",
        "ring-2 ring-inset ring-blue-400/60",
        "shadow-[inset_0_2px_4px_rgba(59,130,246,.25),0_0_8px_rgba(37,99,235,.4)]",
        withHoverGlow &&
          "transition duration-300 ease-[cubic-bezier(.25,1,.5,1)] hover:shadow-[inset_0_2px_6px_rgba(59,130,246,.35),0_0_18px_rgba(59,130,246,.6)]",

        className,
      )}
      {...props}
    >
      {heading && (
        <CardHeader className={cn("pb-2 text-center", headerClassName)}>
          <CardTitle className="text-white">{heading}</CardTitle>
        </CardHeader>
      )}

      <CardContent className={cn("px-4 py-3", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  )
}
