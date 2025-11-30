"use client"

import type { ForumFilters, ForumCategory } from "@/types/forum"

type FilterBarProps = {
  filters: ForumFilters
  onChange: (next: ForumFilters) => void
}

const categories: (ForumCategory | "all")[] = [
  "all",
  "general",
  "announcement",
  "training",
  "game",
  "transport",
]

export function FilterBar({ filters, onChange }: FilterBarProps) {
  return (
    <div className="mt-2 flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-900">Filter by:</span>

        <select
          value={filters.category}
          onChange={e =>
            onChange({
              ...filters,
              category: e.target.value as ForumFilters["category"],
            })
          }
          className="rounded-full bg-transparent px-3 py-1 pr-1 text-sm text-gray-700"
        >
          {categories.map(c => (
            <option
              key={c}
              value={c}
            >
              {c === "all"
                ? "All posts"
                : c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
