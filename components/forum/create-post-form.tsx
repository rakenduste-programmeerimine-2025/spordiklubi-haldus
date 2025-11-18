"use client"

export function CreatePostForm() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base text-gray-900 font-semibold">Create a Post</h2>
        <p className="text-sm text-gray-500">Share something with the team</p>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-900 font-semibold">Category</p>
        <button className="w-full rounded-full bg-[#f2f2f5] px-4 py-2 text-left text-sm text-gray-700 flex items-center justify-between">
          <span>General</span>
          <span>▼</span>
        </button>
      </div>

      <textarea
        className="w-full rounded-3xl bg-[#f2f2f5] px-4 py-3 text-sm text-gray-700 outline-none resize-none min-h-[80px]"
        placeholder="What’s on your mind?"
      />

      <button className="inline-flex items-center gap-2 rounded-full bg-[#1D4ED8] px-5 py-2 text-sm font-semibold text-white">
        <span>➤</span>
        <span>Post</span>
      </button>
    </div>
  )
}