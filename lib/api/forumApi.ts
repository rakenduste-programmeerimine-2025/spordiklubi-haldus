import { createClient } from "@/lib/supabase/client"
import type {
  ForumPost,
  ForumReply,
  ForumCategory,
  ForumFilters,
} from "@/types/forum"

type ForumProfileRef = {
  id: string
  name: string | null
  email: string | null
} | null

type ForumCommentRow = {
  id: number
  content: string
  created_at: string
  profile: ForumProfileRef
}

type ForumPostRow = {
  id: number
  title: string | null
  content: string
  category: string
  created_at: string
  profile: ForumProfileRef
  comments?: ForumCommentRow[] | null
}

type NewPostRow = {
  id: number
  title: string
  content: string
  category: string
  created_at: string
  profile: ForumProfileRef
}

type NewCommentRow = {
  id: number
  content: string
  created_at: string
  profile: ForumProfileRef
}

async function getUserClubId(profileId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("member")
    .select("club_id")
    .eq("profile_id", profileId)
    .single()

  if (error) {
    console.error("Failed to load user club_id", error)
    throw new Error("Could not determine user's club")
  }

  return data.club_id as number
}

export const forumApi = {
  async getPosts(filters: ForumFilters): Promise<ForumPost[]> {
    const supabase = createClient()

    let query = supabase
      .from("forum_post")
      .select(
        `
        id,
        title,
        content,
        category,
        created_at,
        profile:profile_id (
          id,
          name,
          email
        ),
        comments:forum_comment (
          id,
          content,
          created_at,
          profile:profile_id (
            id,
            name,
            email
          )
        )
      `
      )
      .order("created_at", { ascending: false })

    if (filters.category !== "all") {
      query = query.eq("category", filters.category.toLowerCase())
    }

    const search = filters.search.trim()
    if (search !== "") {
      query = query.or(
        `title.ilike.%${search}%,content.ilike.%${search}%`
      )
    }

    const { data, error } = await query
    if (error) throw error

    const rows = (data ?? []) as unknown as ForumPostRow[]

    return rows.map<ForumPost>((row) => {
      const authorName =
        row.profile?.name ??
        row.profile?.email ??
        "Unknown"

      const replies: ForumReply[] =
        row.comments?.map((c: ForumCommentRow) => {
          const commentAuthorName =
            c.profile?.name ??
            c.profile?.email ??
            "Unknown"

          return {
            id: String(c.id),
            message: c.content,
            createdAt: new Date(c.created_at).toLocaleString(),
            authorName: commentAuthorName,
            authorInitials: getInitials(c.profile?.name ?? c.profile?.email),
          }
        }) ?? []

      return {
        id: String(row.id),
        title: row.title ?? "",
        message: row.content,
        category: row.category as ForumCategory,
        createdAt: new Date(row.created_at).toLocaleString(),
        authorName,
        authorInitials: getInitials(row.profile?.name ?? row.profile?.email),
        replies,
      }
    })
  },

  async createPost(input: {
    title: string
    category: string
    message: string
  }): Promise<ForumPost> {
    const supabase = createClient()

    const { data: auth } = await supabase.auth.getUser()
    if (!auth?.user) throw new Error("User not authenticated")

    const profileId = auth.user.id

    const clubId = await getUserClubId(profileId)

    const category = input.category.toLowerCase()

    const nowIso = new Date().toISOString()

    const { data, error } = await supabase
      .from("forum_post")
      .insert({
        profile_id: profileId,
        club_id: clubId,
        title: input.title,
        content: input.message,
        category,
        created_at: nowIso,
      })
      .select(
        `
        id,
        title,
        content,
        category,
        created_at,
        profile:profile_id (
          id,
          name,
          email
        )
      `
      )
      .single()

    if (error) throw error

    const row = data as unknown as NewPostRow

    const authorName =
      row.profile?.name ??
      row.profile?.email ??
      "Unknown"

    return {
      id: String(row.id),
      title: row.title,
      message: row.content,
      category: row.category as ForumCategory,
      createdAt: new Date(row.created_at).toLocaleString(),
      authorName,
      authorInitials: getInitials(row.profile?.name ?? row.profile?.email),
      replies: [],
    }
  },

  async reply(postId: string | number, message: string): Promise<ForumReply> {
    const supabase = createClient()

    const { data: auth } = await supabase.auth.getUser()
    if (!auth?.user) throw new Error("Not authenticated")

    const profileId = auth.user.id
    const nowIso = new Date().toISOString()

    const { data, error } = await supabase
      .from("forum_comment")
      .insert({
        content: message,
        forum_post_id: Number(postId),
        profile_id: profileId,
        created_at: nowIso,
      })
      .select(
        `
        id,
        content,
        created_at,
        profile:profile_id (
          id,
          name,
          email
        )
      `
      )
      .single()

    if (error) throw error

    const row = data as unknown as NewCommentRow

    const authorName =
      row.profile?.name ??
      row.profile?.email ??
      "Unknown"

    return {
      id: String(row.id),
      message: row.content,
      createdAt: new Date(row.created_at).toLocaleString(),
      authorName,
      authorInitials: getInitials(row.profile?.name ?? row.profile?.email),
    }
  },
}

function getInitials(input?: string | null): string {
  if (!input) return "U"

  const trimmed = input.trim()
  if (!trimmed) return "U"

  if (trimmed.includes("@")) {
    return trimmed[0]!.toUpperCase()
  }

  const parts = trimmed.split(/\s+/)
  const first = parts[0]?.[0] ?? ""
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : ""
  const initials = (first + last).toUpperCase()

  return initials || "U"
}