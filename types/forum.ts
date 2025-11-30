export type ForumCategory =
  | "announcement"
  | "training"
  | "transport"
  | "game"
  | "general"

export type ForumReply = {
  id: string
  authorName: string
  authorInitials: string
  authorId?:string
  createdAt: string
  message: string
}

export type ForumPost = {
  id: string
  title: string
  authorName: string
  authorInitials: string
  authorId?: string
  createdAt: string
  category: ForumCategory
  message: string
  replies: ForumReply[]
}

export type ForumFilters = {
  category: ForumCategory | "all"
  search: string
}
