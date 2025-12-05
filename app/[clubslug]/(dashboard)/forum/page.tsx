"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { forumApi } from "@/lib/api/forumApi"
import { CreatePostForm } from "@/components/forum/create-post-form"
import { FilterBar } from "@/components/forum/filter-bar"
import { ForumPostCard } from "@/components/forum/post-card"
import { useParams } from "next/navigation"

import type { ForumPost, ForumFilters } from "@/types/forum"

export default function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [filters, setFilters] = useState<ForumFilters>({
    category: "all",
    search: "",
  })
  const [loading, setLoading] = useState(false)

  const [clubError, setClubError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const supabase = createClient()
  const params = useParams()
  const clubslug = params.clubslug as string

  // 1) Slug validation
  useEffect(() => {
    async function validateSlug() {
      const sb = createClient()

      const { data, error } = await sb
        .from("club")
        .select("id")
        .eq("slug", clubslug)
        .maybeSingle()

      if (error) {
        console.error("[ForumPage] error checking slug:", error)
      }

      if (!data) {
        setClubError("Club not found")
      } else {
        setClubError(null)
      }
    }

    validateSlug()
  }, [clubslug])

  // 2) Load authenticated user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
    })
  }, [])

  // 3) Load posts
  async function loadPosts() {
    if (clubError) return
    setLoading(true)
    try {
      const data = await forumApi.getPosts(filters, clubslug)
      setPosts(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!clubError) loadPosts()
  }, [filters, clubslug, clubError])

  // 4) Post + reply delete handlers
  async function handleDeletePost(postId: string) {
    await forumApi.deletePost(postId)
    await loadPosts()
  }

  async function handleDeleteReply(replyId: string) {
    await forumApi.deleteReply(replyId)
    await loadPosts()
  }

  // 5) Realtime subscriptions
  useEffect(() => {
    if (clubError) return
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
  }, [clubslug, clubError])

  // 6) INVALID SLUG ERROR UI
  if (clubError) {
    return (
      <div className="max-w-3xl mx-auto px-4 pt-10 pb-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-center">
          <h1 className="mb-2 text-lg font-semibold text-red-800">
            Club not found
          </h1>
          <p className="text-sm text-red-700">
            The club you tried to access doesn&apos;t exist or is no longer
            available. Please check the URL or switch to another team.
          </p>
        </div>
      </div>
    )
  }

  // 7) MAIN FORUM UI
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