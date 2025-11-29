import { createClient } from "@/lib/supabase/client"
import type {
  ForumPost,
  ForumReply,
  ForumCategory,
  ForumFilters,
} from "@/types/forum"

// Helper to find user's club_id
async function getUserClubId(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("member")
    .select("club_id")
    .eq("user_id", userId)
    .single()

  if (error) {
    console.error("Failed to load user club_id", error)
    throw new Error("Could not determine user's club")
  }

  return data.club_id
}

export const forumApi = {
  async getPosts(filters: ForumFilters): Promise<ForumPost[]> {
    const supabase = createClient()

    let query = supabase
      .from("forum_post")
      .select(`id, title, content, category, created_at, user_id, club_id`)
      .order("created_at", { ascending: false })

    if (filters.category !== "all") {
      query = query.eq("category", filters.category)
    }

    if (filters.search.trim() !== "") {
      query = query.ilike("content", `%${filters.search}%`)
    }

    const { data: posts, error } = await query
    if (error) throw error

    // Load comments for all posts
    const { data: comments } = await supabase
      .from("forum_comment")
      .select(`id, content, created_at, user_id, forum_post_id`)

    // Load all users referenced by posts + comments
    const userIds = Array.from(
      new Set([
        ...posts.map((p) => p.user_id),
        ...(comments?.map((c) => c.user_id) ?? []),
      ])
    )

    const { data: users } = await supabase
      .from("auth.users")
      .select("id, email")
      .in("id", userIds)

    return posts.map((p) => {
      const postUser = users?.find((u) => u.id === p.user_id)
      const postComments = (comments ?? []).filter(
        (c) => c.forum_post_id === p.id
      )

      return {
        id: p.id,
        title: p.title ?? "",
        message: p.content,
        category: p.category as ForumCategory,
        createdAt: new Date(p.created_at).toLocaleString(),
        authorName: postUser?.email ?? "Unknown",
        authorInitials: getInitial(postUser?.email),
        replies: postComments.map((c) => {
          const commentUser = users?.find((u) => u.id === c.user_id)
          return {
            id: c.id,
            message: c.content,
            createdAt: new Date(c.created_at).toLocaleString(),
            authorName: commentUser?.email ?? "Unknown",
            authorInitials: getInitial(commentUser?.email),
          }
        }),
      }
    })
  },

  async createPost(input: { title: string; category: string; message: string }): Promise<ForumPost> {
    const supabase = createClient()

    // 1) Ensure user is logged in
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) throw new Error("User not authenticated")

    // 2) Get user club_id
    const clubId = await getUserClubId(auth.user.id)

    // 3) Insert post with club_id
    const { data, error } = await supabase
      .from("forum_post")
      .insert({
        user_id: auth.user.id,
        club_id: clubId,
        title: input.title,
        content: input.message,
        category: input.category,
      })
      .select(`id, title, content, category, created_at, user_id`)
      .single()

    if (error) throw error

    // Load user email
    const { data: user } = await supabase
      .from("auth.users")
      .select("email")
      .eq("id", auth.user.id)
      .single()

    return {
      id: data.id,
      title: data.title,
      message: data.content,
      category: data.category,
      createdAt: new Date(data.created_at).toLocaleString(),
      authorName: user?.email ?? "Unknown",
      authorInitials: getInitial(user?.email),
      replies: [],
    }
  },

  async reply(postId: string, message: string): Promise<ForumReply> {
    const supabase = createClient()

    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) throw new Error("Not authenticated")

    const { data, error } = await supabase
      .from("forum_comment")
      .insert({
        content: message,
        forum_post_id: postId,
        user_id: auth.user.id,
      })
      .select(`id, content, created_at, user_id`)
      .single()

    if (error) throw error

    const { data: user } = await supabase
      .from("auth.users")
      .select("email")
      .eq("id", auth.user.id)
      .single()

    return {
      id: data.id,
      message: data.content,
      createdAt: new Date(data.created_at).toLocaleString(),
      authorName: user?.email ?? "Unknown",
      authorInitials: getInitial(user?.email),
    }
  },
}

function getInitial(email?: string | null) {
  return email?.[0]?.toUpperCase() ?? "U"
}