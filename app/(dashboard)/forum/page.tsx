"use client"

import { useEffect, useState } from "react"
import { CreatePostForm } from "@/components/forum/create-post-form"
import { FilterBar } from "@/components/forum/filter-bar"
import { ForumPostCard } from "@/components/forum/post-card"
import { forumApi } from "@/lib/api/forumApi"
import type { ForumPost, ForumFilters } from "@/types/forum"

export default function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [filters, setFilters] = useState<ForumFilters>({
    category: "all",
    search: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  async function loadPosts(currentFilters: ForumFilters) {
    setIsLoading(true)
    try {
      const data = await forumApi.getPosts(currentFilters)
      setPosts(data)
    } finally {
      setIsLoading(false)
    }
  }

  async function refreshPosts() {
    setIsRefreshing(true)
    try {
      const data = await forumApi.getPosts(filters)
      setPosts(data)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadPosts(filters)
  }, [filters])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">Team forum</h1>

      {/* Create post card */}
      <section className="rounded-3xl bg-white px-6 py-5 shadow-sm">
        <CreatePostForm
          onSubmit={async (data) => {
            const newPost = await forumApi.createPost(data)
            setPosts((prev) => [newPost, ...prev])
            refreshPosts()
          }}
        />
      </section>
      <FilterBar filters={filters} onChange={setFilters} />

      {/* Posts list */}
      <div className="space-y-3">
        {isLoading && posts.length === 0 && (
          <p className="text-sm text-gray-500">Loading posts…</p>
        )}

        {!isLoading && posts.length === 0 && (
          <p className="text-sm text-gray-500">
            No posts yet. Be the first to write something!
          </p>
        )}

        {posts.map((post) => (
          <ForumPostCard
            key={post.id}
            post={post}
            onReply={async (message) => {
              const reply = await forumApi.reply(post.id, message)
              setPosts((prev) =>
                prev.map((p) =>
                  p.id === post.id ? { ...p, replies: [...p.replies, reply] } : p
                )
              )
              refreshPosts()
            }}
          />
        ))}
      </div>
      {isRefreshing && (
        <p className="text-xs text-gray-400 text-center">
          Updating...
          </p>
      )}
    </div>
  )
}