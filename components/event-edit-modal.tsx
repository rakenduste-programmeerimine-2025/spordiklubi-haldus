"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { RsvpEvent } from "@/components/event-rsvp-modal"

type EventEditModalProps = {
  event: RsvpEvent
  isOpen: boolean
  isNew?: boolean
  onClose: () => void
  onSave: (event: RsvpEvent) => void
}

const EVENT_TYPES: RsvpEvent["type"][] = [
  "training",
  "game",
  "analysis",
  "other",
]

export function EventEditModal({
  event,
  isOpen,
  isNew = false,
  onClose,
  onSave,
}: EventEditModalProps) {
  const [draft, setDraft] = useState<RsvpEvent>(event)

  // keep draft in sync when open modal for a different event
  useEffect(() => {
    setDraft(event)
  }, [event])

  if (!isOpen) return null

  const handleChange = (field: keyof RsvpEvent, value: string) => {
    setDraft(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    // simple safety: ensure always have some type
    const safeDraft: RsvpEvent = {
      ...draft,
      type: draft.type || "training",
    }

    onSave(safeDraft)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 md:p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs md:text-sm font-medium uppercase tracking-wide text-slate-400">
              {isNew ? "Create event" : "Edit event"}
            </p>
            <h2 className="text-lg md:text-xl font-semibold text-slate-900">
              {draft.title || (isNew ? "New event" : "Event")}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        </div>

        <div className="space-y-4 text-sm md:text-base">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">
              Title
            </label>
            <input
              type="text"
              value={draft.title}
              onChange={e => handleChange("title", e.target.value)}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-[#3156ff] focus:outline-none focus:ring-1 focus:ring-[#3156ff]"
            />
          </div>

          {/* Date, Time */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">
                Date
              </label>
              <input
                type="date"
                value={draft.date}
                onChange={e => handleChange("date", e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-[#3156ff] focus:outline-none focus:ring-1 focus:ring-[#3156ff]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">
                Time
              </label>
              <input
                type="time"
                value={draft.time}
                onChange={e => handleChange("time", e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-[#3156ff] focus:outline-none focus:ring-1 focus:ring-[#3156ff]"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">
              Location
            </label>
            <input
              type="text"
              value={draft.location}
              onChange={e => handleChange("location", e.target.value)}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-[#3156ff] focus:outline-none focus:ring-1 focus:ring-[#3156ff]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">
              Description
            </label>
            <textarea
              value={draft.description}
              onChange={e => handleChange("description", e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-[#3156ff] focus:outline-none focus:ring-1 focus:ring-[#3156ff]"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">
              Type
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {EVENT_TYPES.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleChange("type", type)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${
                    draft.type === type
                      ? "border-[#3156ff] bg-[#eef1ff] text-[#3156ff]"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-full bg-[#3156ff] px-5 py-2 text-sm font-semibold text-white hover:bg-[#2342d6]"
          >
            {isNew ? "Create event" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  )
}
