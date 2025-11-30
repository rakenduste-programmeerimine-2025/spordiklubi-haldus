"use client"

import { useState } from "react"

type ForumReplyFormProps = {
  onSubmit: (message: string) => Promise<void> | void
  onCancel?: () => void
}

export function ForumReplyForm({ onSubmit, onCancel }: ForumReplyFormProps) {
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!message.trim()) return

    try {
      setIsSubmitting(true)
      await onSubmit(message.trim())
      setMessage("")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2 pl-12">
      <textarea
        className="w-full resize-none rounded-2xl bg-[#f2f2f5] px-3 py-2 text-sm text-gray-700 outline-none"
        rows={2}
        placeholder="Write a reply..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
          }
        }}
      />

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-[#1D4ED8] px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "Reply"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-gray-500"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}