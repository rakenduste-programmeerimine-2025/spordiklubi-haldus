"use client"
import React from "react"

type GlassButtonProps = {
  children?: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  title?: string
  as?: "button" | "a"
  href?: string
}

export default function GlassButton({
  children = "Click Me",
  onClick,
  className = "",
  disabled,
  title,
  as = "button",
  href,
}: GlassButtonProps) {
  const Component = as === "a" ? "a" : "button"

  return (
    <Component
      {...(as === "a" ? { href } : { disabled, onClick })}
      title={title}
      className={[
        // layout
        "relative inline-flex items-center justify-center",
        "rounded-full px-6 py-3",
        // type
        "text-white font-semibold tracking-tight",
        // deep blue glass background
        "bg-gradient-to-br from-blue-700/80 via-blue-600/70 to-blue-400/60",
        "backdrop-blur-[2px]",
        // brighter glowing blue outline
        "ring-2 ring-inset ring-blue-400/70",
        "shadow-[inset_0_2px_6px_rgba(59,130,246,.3),0_0_12px_rgba(37,99,235,.6),0_0_28px_rgba(59,130,246,.5)]",
        // hover / active
        "transition-transform duration-300 ease-&lsqb;cubic-bezier(.25,1,.5,1)&rsqb",
        "hover:scale-[0.98] hover:shadow-[inset_0_2px_8px_rgba(59,130,246,.35),0_0_18px_rgba(59,130,246,.7),0_0_40px_rgba(59,130,246,.6)]",
        "active:scale-95",
        // focus ring
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/90",
        // disabled
        "disabled:opacity-50 disabled:pointer-events-none",
        "group",
        className,
      ].join(" ")}
    >
      {/* label */}
      <span className="[text-shadow:0_0.4em_1em_rgba(0,0,0,.35),0_0_.35em_rgba(59,130,246,.5)]">
        {children}
      </span>

      {/* thin blue edge (fake chrome outline) */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-blue-200/50"
      />
    </Component>
  )
}
