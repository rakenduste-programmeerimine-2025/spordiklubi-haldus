"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { forumApi } from "@/lib/api/forumApi"
import { CreatePostForm } from "@/components/forum/create-post-form"
import { FilterBar } from "@/components/forum/filter-bar"
import { ForumPostCard } from "@/components/forum/post-card"
import { useParams } from "next/navigation"    // ✅ NEW

import type { ForumPost, ForumFilters } from "@/types/forum"

export default function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [filters, setFilters] = useState<ForumFilters>({
    category: "all",
    search: "",
  })
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  //NEW — read slug from URL
  const params = useParams()
  const clubslug = params.clubslug as string

  // Get current user ID
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
    })
  }, [])

  async function loadPosts() {
    setLoading(true)
    try {
      const data = await forumApi.getPosts(filters, clubslug)
      setPosts(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [filters, clubslug])

  async function handleDeletePost(postId: string) {
    await forumApi.deletePost(postId)
    await loadPosts()
  }

  async function handleDeleteReply(replyId: string) {
    await forumApi.deleteReply(replyId)
    await loadPosts()
  }

  // Realtime updates
  useEffect(() => {
    const sb = createClient()

    const channel = sb
      .channel("forum-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "forum_post" },
        loadPosts
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "forum_comment" },
        loadPosts
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "forum_post" },
        loadPosts
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "forum_comment" },
        loadPosts
      )
      .subscribe()

    return () => {
      sb.removeChannel(channel)
    }
  }, [clubslug])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">Team Forum</h1>

      {/* Create a post */}
      <section className="rounded-[32px] bg-white px-6 py-5 shadow-sm">
        <CreatePostForm
          onSubmit={async data => {
            await forumApi.createPost(data, clubslug)
          }}
        />
      </section>

      <FilterBar
        filters={filters}
        onChange={setFilters}
      />

      <div className="space-y-3">
        {loading && posts.length === 0 && (
          <p className="text-sm text-gray-500">Loading posts…</p>
        )}

        {!loading && posts.length === 0 && (
          <p className="text-sm text-gray-500">
            No posts yet. Be the first to write something!
          </p>
        )}

        {posts.map(post => (
          <ForumPostCard
            key={post.id}
            post={post}
            userId={userId}
            isOwner={post.authorId === userId}
            onDelete={() => handleDeletePost(post.id)}
            onDeleteReply={replyId => handleDeleteReply(replyId)}
            onReply={async message => {
              await forumApi.reply(post.id, message)
            }}
          />
        ))}
      </div>
    </div>
  )
}