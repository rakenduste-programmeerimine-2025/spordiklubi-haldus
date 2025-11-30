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

  // Get current user ID
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
    })
  }, [])

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

  async function handleDeletePost(postId: string) {
    await forumApi.deletePost(postId)
    await loadPosts()
  }

  async function handleDeleteReply(replyId: string) {
    await forumApi.deleteReply(replyId)
    await loadPosts()
  }

  useEffect(() => {
    const sb = createClient()

    const channel = sb
      .channel("forum-realtime")
      // INSERT post
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "forum_post" },
        async () => {
          await loadPosts()
        }
      )
      // INSERT reply
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "forum_comment" },
        async () => {
          await loadPosts()
        }
      )
      // DELETE post
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "forum_post" },
        async () => {
          await loadPosts()
        }
      )
      // DELETE reply
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "forum_comment" },
        async () => {
          await loadPosts()
        }
      )
      .subscribe()

    return () => {
      sb.removeChannel(channel)
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
            userId={userId}
            isOwner={post.authorId === userId}
            onDelete={() => handleDeletePost(post.id)}
            onDeleteReply={(replyId) => handleDeleteReply(replyId)}
            onReply={async (message) => {
              await forumApi.reply(post.id, message)
            }}
          />
        ))}
      </div>
    </div>
  )
}