" use client "
import { CreatePostForm } from "@/components/forum/create-post-form"

export default function ForumPage() {
  return (
    <div className="space-y-6">
      {/* Page title */}
      <h1 className="text-2xl font-semibold text-gray-900">Team forum</h1>

      
      <section className="rounded-3xl bg-white shadow-sm px-6 py-5">
        <CreatePostForm />
      </section>
    </div>
  )
}
