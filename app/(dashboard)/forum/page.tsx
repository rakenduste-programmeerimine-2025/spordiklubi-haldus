"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { forumApi } from "@/lib/api/forumApi"
import { CreatePostForm } from "@/components/forum/create-post-form"
import { FilterBar } from "@/components/forum/filter-bar"
import { ForumPostCard } from "@/components/forum/post-card"

import type { ForumPost, ForumFilters } from "@/types/forum"

export default function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [filters, setFilters] = useState<ForumFilters>({
    category: "all",
    search: "",
  })
  const [loading, setLoading] = useState(false)

  async function loadPosts() {
    setLoading(true)
    try {
      const data = await forumApi.getPosts(filters)
      setPosts(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [filters])

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel("forum-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "forum_post" },
        async () => {
          await loadPosts()
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "forum_comment" },
        async () => {
          await loadPosts()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">Team Forum</h1>

      {/* Create a post */}
      <section className="rounded-3xl bg-white px-6 py-5 shadow-sm">
        <CreatePostForm
          onSubmit={async (data) => {
            await forumApi.createPost(data)
          }}
        />
      </section>

      <FilterBar filters={filters} onChange={setFilters} />

      <div className="space-y-3">
        {loading && posts.length === 0 && (
          <p className="text-sm text-gray-500">Loading posts…</p>
        )}

        {!loading && posts.length === 0 && (
          <p className="text-sm text-gray-500">
            No posts yet. Be the first to write something!
          </p>
        )}

        {posts.map((post) => (
          <ForumPostCard
            key={post.id}
            post={post}
            onReply={async (message) => {
              await forumApi.reply(post.id, message)
            }}
          />
        ))}
      </div>
    </div>
  )
}