"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SignupButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
  isLoading?: boolean
}

export function SignupButton({
  label = "Click Me",
  isLoading = false,
  className,
  ...props
}: SignupButtonProps) {
  return (
    <Button
      {...props}
      disabled={isLoading || props.disabled}
      className={cn(
        "relative w-[160px] h-[45px] mx-auto py-2 rounded-full",
        "text-white font-semibold text-xl tracking-tight",
        "bg-gradient-to-br from-blue-700/80 via-blue-600/70 to-blue-400/60",
        "backdrop-blur-[2px]",
        "ring-2 ring-inset ring-blue-400/70",
        "shadow-[inset_0_2px_6px_rgba(59,130,246,.3),0_0_10px_rgba(37,99,235,.6),0_0_20px_rgba(59,130,246,.4)]",
        "transition-transform duration-300 ease-[cubic-bezier(.25,1,.5,1)]",
        "hover:scale-[0.95]",
        "hover:shadow-[inset_0_2px_8px_rgba(59,130,246,.35),0_0_18px_rgba(59,130,246,.7),0_0_40px_rgba(59,130,246,.6)]",
        "active:scale-95",
        className,
      )}
    >
      {isLoading ? "Creating..." : label}
    </Button>
  )
}
