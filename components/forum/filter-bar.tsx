"use client"

import type { ForumFilters, ForumCategory } from "@/types/forum"

type FilterBarProps = {
  filters: ForumFilters
  onChange: (next: ForumFilters) => void
}

const categories: (ForumCategory | "all")[] = [
  "all",
  "announcement",
  "training",
  "transport",
  "general",
]

export function FilterBar({ filters, onChange }: FilterBarProps) {
  return (
    <div className="mt-2 flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-900">Filter by:</span>

        <select
          value={filters.category}
          onChange={(e) =>
            onChange({
              ...filters,
              category: e.target.value as ForumFilters["category"],
            })
          }
          className="rounded-full bg-transparent px-3 py-1 text-sm text-gray-700"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "all"
                ? "All posts"
                : c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* <input
        type="search"
        placeholder="Search..."
        value={filters.search}
        onChange={(e) =>
          onChange({
            ...filters,
            search: e.target.value,
          })
        }
        className="w-40 rounded-full bg-[#f2f2f5] px-3 py-1 text-sm text-gray-700 outline-none"
      /> */}
    </div>
  )
}