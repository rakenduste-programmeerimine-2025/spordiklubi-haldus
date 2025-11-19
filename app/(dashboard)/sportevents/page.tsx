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
} from "lucide-react"
import {
  EventRsvpModal,
  type RsvpEvent,
  type RSVPStatus,
} from "@/components/event-rsvp-modal"

// You will add EventEditModal in the next step

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
  const [events] = useState<RsvpEvent[]>(mockEvents)
  const [myRsvps, setMyRsvps] = useState<Record<number, MyRsvp>>({})
  const [filter, setFilter] = useState<EventFilter>("upcoming")
  const [activeRsvpEvent, setActiveRsvpEvent] = useState<RsvpEvent | null>(null)

  const currentUserInitials = getInitials(CURRENT_USER_NAME)

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
        onClick={() => setActiveRsvpEvent(event)}
        className="relative w-full text-left focus:outline-none cursor-pointer"
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
          {/* Top row: title + type chip */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 md:text-base">
                {event.title || "Untitled event"}
              </h2>
            </div>

            <span
              className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ${chipClasses}`}
            >
              {event.type}
            </span>
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
      {/* Header row: left filter */}
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
          <p className="text-sm text-slate-500">See all trainings and games</p>
        </div>
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
    </div>
  )
}
