"use client"

import { useState } from "react"

type CreatePostFormProps = {
  onSubmit: (data: {
    title: string
    category: string
    message: string
  }) => Promise<void> | void
}

const categories = ["general", "announcement", "training", "game", "transport"]

export function CreatePostForm({ onSubmit }: CreatePostFormProps) {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("general")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim() || !message.trim()) return

    try {
      setIsSubmitting(true)

      await onSubmit({
        title: title.trim(),
        category: category.toLowerCase(),
        message: message.trim(),
      })

      setTitle("")
      setMessage("")
      setCategory("general")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit}
    >
      <div>
        <h2 className="text-lg text-gray-900 font-semibold">Create a Post</h2>
        <p className="text-sm text-gray-500">Share something with the team</p>
      </div>

      <div className="space-y-2">
        <p className="text-base text-gray-900 font-semibold">Category</p>

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="flex w-full items-center justify-between rounded-full bg-[#f2f2f5] px-4 py-2 text-left text-sm text-gray-700"
        >
          {categories.map(c => (
            <option
              key={c}
              value={c}
            >
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <p className="text-base text-gray-900 font-semibold">Title</p>
        <input
          type="text"
          className="w-full rounded-full bg-[#f2f2f5] px-4 py-2 text-sm text-gray-700 outline-none"
          placeholder="Post title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>

      <textarea
        className="min-h-[80px] w-full resize-none rounded-3xl bg-[#f2f2f5] px-4 py-3 text-sm text-gray-700 outline-none"
        placeholder="What’s on your mind?"
        value={message}
        onChange={e => setMessage(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
          }
        }}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 rounded-full bg-[#1D4ED8] px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        <span>➤</span>
        <span>{isSubmitting ? "Posting..." : "Post"}</span>
      </button>
    </form>
  )
}
