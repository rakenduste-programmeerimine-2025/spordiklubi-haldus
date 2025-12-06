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

// ------------------------------------------------------
// GET CLUB ID FROM SLUG (safe, returns null on invalid slug)
// ------------------------------------------------------
async function getClubIdBySlug(slug: string): Promise<number | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("club")
    .select("id")
    .eq("slug", slug)
    .maybeSingle()

  if (error) {
    console.error("[forumApi] Failed to load club by slug:", error)
    return null
  }

  if (!data) return null

  return data.id as number
}

// ------------------------------------------------------
// FORUM API
// ------------------------------------------------------
export const forumApi = {
  // ------------------------------
  // GET POSTS (slug-based)
  // ------------------------------
  async getPosts(
    filters: ForumFilters,
    slug: string
  ): Promise<ForumPost[]> {
    const supabase = createClient()

    const clubId = await getClubIdBySlug(slug)
    if (!clubId) {
      // Invalid slug → empty dataset
      return []
    }

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
      .eq("club_id", clubId)
      .order("created_at", { ascending: false })

    if (filters.category !== "all") {
      query = query.eq("category", filters.category.toLowerCase())
    }

    if (filters.search.trim() !== "") {
      const s = filters.search.trim()
      query = query.or(`title.ilike.%${s}%,content.ilike.%${s}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error("[forumApi] Failed loading posts:", error)
      return []
    }

    const rows = (data ?? []) as unknown as ForumPostRow[]

    return rows.map(row => {
      const authorName =
        row.profile?.name ?? row.profile?.email ?? "Unknown"

      const replies =
        row.comments?.map(c => ({
          id: String(c.id),
          message: c.content,
          createdAt: new Date(c.created_at).toLocaleString(),
          authorName:
            c.profile?.name ?? c.profile?.email ?? "Unknown",
          authorInitials: getInitials(
            c.profile?.name ?? c.profile?.email
          ),
          authorId: c.profile?.id,
        })) ?? []

      return {
        id: String(row.id),
        title: row.title ?? "",
        message: row.content,
        category: row.category as ForumCategory,
        createdAt: new Date(row.created_at).toLocaleString(),
        authorName,
        authorInitials: getInitials(
          row.profile?.name ?? row.profile?.email
        ),
        authorId: row.profile?.id,
        replies,
      }
    })
  },

  // ------------------------------
  // CREATE POST
  // ------------------------------
  async createPost(
    input: { title: string; category: string; message: string },
    slug: string
  ): Promise<ForumPost> {
    const supabase = createClient()

    const { data: auth } = await supabase.auth.getUser()
    if (!auth?.user) throw new Error("User not authenticated")

    const profileId = auth.user.id
    const clubId = await getClubIdBySlug(slug)
    if (!clubId) throw new Error("Invalid club slug")

    const nowIso = new Date().toISOString()

    const { data, error } = await supabase
      .from("forum_post")
      .insert({
        profile_id: profileId,
        club_id: clubId,
        title: input.title,
        content: input.message,
        category: input.category.toLowerCase(),
        created_at: nowIso,
      })
      .select(
        `
        id,
        title,
        content,
        category,
        created_at,
        profile:profile_id(
          id,
          name,
          email
        )
      `
      )
      .single()

    if (error) throw error

    const rawProfile = data.profile as unknown
    const profile: ForumProfileRef = isProfile(rawProfile)
      ? {
          id: rawProfile.id,
          name: rawProfile.name ?? null,
          email: rawProfile.email ?? null,
        }
      : null

    return {
      id: String(data.id),
      title: data.title,
      message: data.content,
      category: data.category,
      createdAt: new Date(data.created_at).toLocaleString(),
      authorName: profile?.name ?? profile?.email ?? "Unknown",
      authorInitials: getInitials(profile?.name ?? profile?.email),
      authorId: profile?.id,
      replies: [],
    }
  },

  // ------------------------------
  // ADD REPLY
  // ------------------------------
  async reply(
    postId: string | number,
    message: string
  ): Promise<ForumReply> {
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

    const rawProfile = data.profile as unknown
    const profile: ForumProfileRef = isProfile(rawProfile)
      ? {
          id: rawProfile.id,
          name: rawProfile.name ?? null,
          email: rawProfile.email ?? null,
        }
      : null

    return {
      id: String(data.id),
      message: data.content,
      createdAt: new Date(data.created_at).toLocaleString(),
      authorName: profile?.name ?? profile?.email ?? "Unknown",
      authorInitials: getInitials(profile?.name ?? profile?.email),
    }
  },

  // ------------------------------
  // DELETE POST
  // ------------------------------
  async deletePost(postId: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from("forum_post")
      .delete()
      .eq("id", postId)

    if (error) throw error
  },

  // ------------------------------
  // DELETE REPLY
  // ------------------------------
  async deleteReply(replyId: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from("forum_comment")
      .delete()
      .eq("id", replyId)

    if (error) throw error
  },
}

// ------------------------------------------------------
// HELPERS
// ------------------------------------------------------
function isProfile(obj: unknown): obj is NonNullable<ForumProfileRef> {
  if (!obj || typeof obj !== "object") return false
  const o = obj as Record<string, unknown>
  return (
    typeof o.id === "string" &&
    ("name" in o || "email" in o)
  )
}

function getInitials(input?: string | null): string {
  if (!input) return "U"
  const trimmed = input.trim()
  if (!trimmed) return "U"

  if (trimmed.includes("@")) return trimmed[0]!.toUpperCase()

  const parts = trimmed.split(/\s+/)
  const first = parts[0]?.[0] ?? ""
  const last =
    parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : ""

  return (first + last).toUpperCase() || "U"
}