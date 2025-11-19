// app/(dashboard)/sportevents/page.tsx
"use client"

import { useState } from "react"
import {
  ChevronDown,
  Clock,
  MapPin,
  Check,
  X,
  HelpCircle,
  Minus,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react"
import {
  EventRsvpModal,
  type RsvpEvent,
  type RSVPStatus,
} from "@/components/event-rsvp-modal"
import { EventEditModal } from "@/components/event-edit-modal"

const mockEvents: RsvpEvent[] = [
  {
    id: 1,
    title: "Team training",
    date: "2025-10-18",
    time: "18:00",
    location: "Kuressaare kunstmuruväljak, talve 88a",
    description: "Focus on defense drills and team coordination",
    type: "training",
    attendees: [],
  },
  {
    id: 2,
    title: "League game vs FC Tartu",
    date: "2025-10-20",
    time: "19:30",
    location: "Kuressaare staadion",
    description: "Home game, meet at 18:30",
    type: "game",
    attendees: [],
  },
  {
    id: 3,
    title: "League game vs FC Tallinn",
    date: "2025-11-24",
    time: "19:30",
    location: "Kuressaare staadion",
    description: "Home game, meet at 18:30",
    type: "game",
    attendees: [],
  },
  {
    id: 4,
    title: "Team training",
    date: "2025-11-28",
    time: "18:00",
    location: "Kuressaare kunstmuruväljak, talve 88a",
    description: "Focus on attack drills and set pieces",
    type: "training",
    attendees: [],
  },
]

type MyRsvp = {
  status: RSVPStatus
  note: string
}

// simple helper for now – later you can take this from logged-in user
function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map(part => part[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("")
}

const CURRENT_USER_NAME = "Sarah Johnson"
// later: from Supabase/profile
const CURRENT_USER_ROLE: "coach" | "player" = "coach"

type EventFilter = "upcoming" | "past"

export default function EventsPage() {
  const [events, setEvents] = useState<RsvpEvent[]>(mockEvents)
  const [myRsvps, setMyRsvps] = useState<Record<number, MyRsvp>>({})
  const [filter, setFilter] = useState<EventFilter>("upcoming")
  const [isManaging, setIsManaging] = useState(false)

  const [activeRsvpEvent, setActiveRsvpEvent] = useState<RsvpEvent | null>(null)
  const [editingEvent, setEditingEvent] = useState<RsvpEvent | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const handleSaveRsvp = (
    eventId: number,
    data: { status: RSVPStatus; note: string },
  ) => {
    setMyRsvps(prev => ({
      ...prev,
      [eventId]: data,
    }))
    // later: send to Supabase
  }

  const handleDeleteEvent = (eventId: number) => {
    setEvents(prev => prev.filter(e => e.id !== eventId))
    // later: delete in Supabase
  }

  const handleAddEvent = () => {
    const nextId = events.length ? Math.max(...events.map(e => e.id)) + 1 : 1

    const blankEvent: RsvpEvent = {
      id: nextId,
      title: "",
      date: "2025-11-01",
      time: "18:00",
      location: "",
      description: "",
      type: "training",
      attendees: [],
    }

    setIsCreating(true)
    setEditingEvent(blankEvent)
  }

  const handleSaveEvent = (updated: RsvpEvent) => {
    setEvents(prev => {
      const exists = prev.some(e => e.id === updated.id)
      if (!exists) {
        return [...prev, updated]
      }
      return prev.map(e => (e.id === updated.id ? updated : e))
    })
    // later: upsert in Supabase
  }

  const currentUserInitials = getInitials(CURRENT_USER_NAME)

  // Separate upcoming vs past by date
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date)
    eventDate.setHours(0, 0, 0, 0)

    if (filter === "upcoming") {
      return eventDate >= today
    } else {
      return eventDate < today
    }
  })

  // --- Event pill (RSVP in normal mode, edit/delete in manage mode) ---
  const renderEventCard = (event: RsvpEvent) => {
    const myRsvp = myRsvps[event.id]

    // RSVP status → icon + label
    let StatusIcon = Minus
    let statusLabel = "No response"

    if (myRsvp?.status === "going") {
      StatusIcon = Check
      statusLabel = "Going"
    } else if (myRsvp?.status === "not_going") {
      StatusIcon = X
      statusLabel = "Not going"
    } else if (myRsvp?.status === "maybe") {
      StatusIcon = HelpCircle
      statusLabel = "Maybe"
    }

    const baseLight =
      event.type === "game"
        ? "bg-[#FFF4E6]"
        : event.type === "training"
          ? "bg-[#EFF6FF]"
          : event.type === "analysis"
            ? "bg-[#ECFDF5]"
            : "bg-[#eef1ff]"

    const baseDark =
      event.type === "game"
        ? "bg-[#FB923C]"
        : event.type === "training"
          ? "bg-[#3156ff]"
          : event.type === "analysis"
            ? "bg-[#16A34A]"
            : "bg-[#3156ff]"

    const chipClasses =
      event.type === "game"
        ? "bg-[#FFE5C2] text-[#9A3412]"
        : event.type === "training"
          ? "bg-[#DBEAFE] text-[#1D4ED8]"
          : event.type === "analysis"
            ? "bg-[#DCFCE7] text-[#15803D]"
            : "bg-slate-200 text-slate-700"

    return (
      <button
        key={event.id}
        type="button"
        onClick={() => {
          if (!isManaging) {
            setActiveRsvpEvent(event)
          }
        }}
        className={`relative w-full text-left focus:outline-none ${
          isManaging ? "cursor-default" : "cursor-pointer"
        }`}
      >
        {/* Dark pill behind – left arch */}
        <div
          className={`
            pointer-events-none absolute inset-0 rounded-[40px]
            ${baseDark}
          `}
        />

        {/* Light pill in front */}
        <div
          className={`
            relative ml-2 rounded-[40px] px-6 py-4 md:px-7 md:py-5
            shadow-sm hover:-translate-y-0.5 transition-transform
            ${baseLight}
          `}
        >
          {/* Top row: title + type chip + (coach manage icons) */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 md:text-base">
                {event.title || "Untitled event"}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ${chipClasses}`}
              >
                {event.type}
              </span>

              {CURRENT_USER_ROLE === "coach" && isManaging && (
                <div className="flex items-center gap-1 text-slate-600">
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation()
                      setIsCreating(false)
                      setEditingEvent(event)
                    }}
                    className="rounded-full p-1 hover:bg-slate-200"
                    aria-label="Edit event"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation()
                      handleDeleteEvent(event.id)
                    }}
                    className="rounded-full p-1 hover:bg-slate-200"
                    aria-label="Delete event"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Time / location / description */}
          <div className="mt-3 space-y-1.5 text-xs text-slate-600 md:text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" />
              <span>{event.location || "Location to be decided"}</span>
            </div>
            <p className="mt-1 text-xs text-slate-700 md:text-sm">
              {event.description || "Add description for this event"}
            </p>
          </div>

          {/* Divider + initials + status on right */}
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-200 pt-3">
            {/* Left: user avatar + name */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-[11px] font-semibold text-slate-700">
                {currentUserInitials}
              </div>
              <span className="text-xs text-slate-800 md:text-sm">
                {CURRENT_USER_NAME.split(" ")[0]}
              </span>
            </div>

            {/* Right: RSVP status icon + label */}
            <div className="flex items-center gap-2 text-slate-700">
              <StatusIcon className="h-5 w-5" />
              <span className="text-xs font-medium md:text-sm">
                {statusLabel}
              </span>
            </div>
          </div>
        </div>
      </button>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header row: left filter, right manage / create buttons */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <button
            type="button"
            onClick={() =>
              setFilter(prev => (prev === "upcoming" ? "past" : "upcoming"))
            }
            className="flex items-center gap-2"
          >
            <h1 className="text-2xl font-semibold text-slate-900">
              {filter === "upcoming" ? "Upcoming" : "Past"}
            </h1>
            <ChevronDown
              className={`h-4 w-4 text-slate-500 transition-transform ${
                filter === "past" ? "rotate-180" : ""
              }`}
            />
          </button>
          <p className="text-sm text-slate-500">
            {isManaging
              ? "Manage and edit your events"
              : "See all trainings and games"}
          </p>
        </div>

        {CURRENT_USER_ROLE === "coach" && (
          <div className="mt-1 flex items-center gap-2">
            {/* Create event (only when managing) */}
            {isManaging && (
              <button
                type="button"
                onClick={handleAddEvent}
                className="inline-flex items-center gap-2 rounded-full bg-[#3156ff] px-4 py-2 text-sm font-medium text-white hover:bg-[#2442cc]"
              >
                <Plus className="h-4 w-4" />
                Create event
              </button>
            )}

            {/* Manage Events Toggle (blue as well) */}
            <button
              type="button"
              onClick={() => setIsManaging(prev => !prev)}
              className={`
        inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white
        ${isManaging ? "bg-[#2442cc]" : "bg-[#3156ff]"}
        hover:bg-[#2442cc]
      `}
            >
              {isManaging ? "Done" : "Manage events"}
            </button>
          </div>
        )}
      </div>

      {/* Events list */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
            {filter === "upcoming"
              ? "No upcoming events yet."
              : "No past events to show yet."}
          </div>
        ) : (
          filteredEvents.map(event => renderEventCard(event))
        )}
      </div>

      {/* RSVP modal (both coach & player) */}
      {activeRsvpEvent && (
        <EventRsvpModal
          event={activeRsvpEvent}
          isOpen={!!activeRsvpEvent}
          onClose={() => setActiveRsvpEvent(null)}
          onSave={data => handleSaveRsvp(activeRsvpEvent.id, data)}
          currentUserRole={CURRENT_USER_ROLE}
        />
      )}

      {/* Edit / Create event modal (coach only) */}
      {editingEvent && CURRENT_USER_ROLE === "coach" && (
        <EventEditModal
          event={editingEvent}
          isOpen={!!editingEvent}
          isNew={isCreating}
          onClose={() => {
            setEditingEvent(null)
            setIsCreating(false)
          }}
          onSave={handleSaveEvent}
        />
      )}
    </div>
  )
}
