"use client"

import type { ForumPost } from "@/types/forum"
import { useState } from "react"
import { ForumReplyForm } from "./reply-form"

type ForumPostCardProps = {
  post: ForumPost
  onReply: (message: string) => Promise<void> | void
}

export function ForumPostCard({ post, onReply }: ForumPostCardProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)

  const categoryLabel =
    post.category.charAt(0).toUpperCase() + post.category.slice(1)

  return (
    <article className="rounded-3xl bg-white px-6 py-4 shadow-sm">
      {/* Header */}
      <header className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f2f2f5] text-sm font-semibold text-gray-700">
          {post.authorInitials}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-900">
              {post.authorName}
            </p>

            <span className="rounded-full bg-[#1D4ED8]/10 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#1D4ED8]">
              {categoryLabel}
            </span>
          </div>

          <p className="text-xs text-gray-500">{post.createdAt}</p>
        </div>
      </header>

      {/* Title */}
      <h2 className="mt-3 text-lg font-semibold text-gray-900">
        {post.title}
      </h2>

      {/* Message */}
      <p className="mt-4 text-sm text-gray-800 whitespace-pre-line">
        {post.message}
      </p>

      {/* Reply button */}
      <button
        type="button"
        onClick={() => setShowReplyForm((prev) => !prev)}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-1.5 text-xs font-medium text-gray-700"
      >
        <span>▢</span>
        <span>Reply</span>
      </button>

      {/* Replies */}
      {post.replies.length > 0 && (
        <div className="mt-4 space-y-3 pl-12">
          {post.replies.map((reply) => (
            <div key={reply.id} className="text-sm text-gray-800">
              <p className="font-semibold text-gray-900">
                {reply.authorName}{" "}
                <span className="ml-1 text-xs text-gray-500">
                  {reply.createdAt}
                </span>
              </p>

              <p className="text-sm text-gray-800 whitespace-pre-line">
                {reply.message}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Reply form */}
      {showReplyForm && (
        <ForumReplyForm
          onSubmit={async (message) => {
            await onReply(message)
            setShowReplyForm(false)
          }}
          onCancel={() => setShowReplyForm(false)}
        />
      )}
    </article>
  )
}