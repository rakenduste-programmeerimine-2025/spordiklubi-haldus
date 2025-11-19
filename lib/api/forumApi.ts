import type { ForumPost, ForumReply, ForumCategory, ForumFilters } from "@/types/forum"

let nextPostId = 2
let nextReplyId = 1

const posts: ForumPost[] = [
  {
    id: "1",
    authorName: "Sarah Johnson",
    authorInitials: "SJ",
    createdAt: "about 8 hours ago",
    category: "announcement",
    message:
      "Welcome to TeamSync! Use this forum to share messages, coordinate transportation, and stay connected with the team.",
    replies: [],
  },
]

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function filterPosts(allPosts: ForumPost[], filters: ForumFilters): ForumPost[] {
  let result = [...allPosts]

  if (filters.category !== "all") {
    result = result.filter((p) => p.category === filters.category)
  }

  if (filters.search.trim()) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      (p) =>
        p.message.toLowerCase().includes(q) ||
        p.authorName.toLowerCase().includes(q)
    )
  }

  return result.slice().reverse()
}

export const forumApi = {
  async getPosts(filters: ForumFilters): Promise<ForumPost[]> {
    await delay(400)
    return filterPosts(posts, filters)
  },

  async createPost(input: { category: string; message: string }): Promise<ForumPost> {
    await delay(400)

    const category = (input.category.toLowerCase() as ForumCategory) ?? "general"

    const newPost: ForumPost = {
      id: String(nextPostId++),
      authorName: "Sarah Johnson",
      authorInitials: "SJ",
      createdAt: "just now",
      category,
      message: input.message,
      replies: [],
    }

    posts.push(newPost)
    return newPost
  },

  async reply(postId: string, message: string): Promise<ForumReply> {
    await delay(400)

    const reply: ForumReply = {
      id: String(nextReplyId++),
      authorName: "Sarah Johnson",
      authorInitials: "SJ",
      createdAt: "just now",
      message,
    }

    const post = posts.find((p) => p.id === postId)
    if (post) {
      post.replies.push(reply)
    }

    return reply
  },
}