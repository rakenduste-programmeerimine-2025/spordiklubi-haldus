"use client"

import { useState } from "react"
import { format } from "date-fns"
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
    date: "2025-11-30",
    time: "18:00",
    location: "Kuressaare kunstmuruväljak, talve 88a",
    description: "Focus on defense drills and team coordination",
    type: "training",
    attendees: [
      { id: 1, name: "Marko Saar", status: "going" },
      { id: 2, name: "Anna Kask", status: "going" },
      { id: 3, name: "Karl Parts", status: "going" },
      { id: 4, name: "Laura Vaher", status: "going" },
      { id: 5, name: "Marek Tamm", status: "going" },
      { id: 6, name: "Jaanus Tamm", status: "going" },
      { id: 7, name: "Mari-Liis Pärn", status: "going" },
      { id: 8, name: "Rasmus Koppel", status: "going" },
      { id: 9, name: "Reio Laas", status: "going" },
      { id: 10, name: "Andri Kask", status: "going" },
      { id: 11, name: "Triin Mets", status: "going" },
      { id: 12, name: "Kertu Noor", status: "going" },
      { id: 13, name: "Madis Õun", status: "going" },
      { id: 14, name: "Oliver Rein", status: "going" },
      { id: 15, name: "Grete Kask", status: "going" },
      { id: 16, name: "Siim Laan", status: "going" },
      { id: 17, name: "Kaisa Roos", status: "going" },
      { id: 18, name: "Tanel Kütt", status: "going" },
      { id: 19, name: "Liis Aru", status: "going" },
      { id: 20, name: "Sander Tamm", status: "going" },

      // 5 not going
      {
        id: 21,
        name: "Martin Sepp",
        status: "not_going",
        note: "My ankle hurts",
      },
      { id: 22, name: "Kelli Piir", status: "not_going" },
      { id: 23, name: "Helen Kuus", status: "not_going" },
      { id: 24, name: "Taavi Rannamäe", status: "not_going" },
      { id: 25, name: "Anet Kuut", status: "not_going" },

      // 2 maybe
      {
        id: 26,
        name: "Karl-Erik Tamm",
        status: "maybe",
        note: "My ankle hurts",
      },
      { id: 27, name: "Pille Saar", status: "maybe" },
    ],
  },
  {
    id: 2,
    title: "League game vs FC Tartu",
    date: "2025-12-03",
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
  {
    id: 5,
    title: "Team training",
    date: "2025-12-05",
    time: "18:00",
    location: "Kuressaare kunstmuruväljak, talve 88a",
    description: "Focus on attack drills and set pieces",
    type: "training",
    attendees: [],
  },
  {
    id: 6,
    title: "Team training",
    date: "2025-12-06",
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

// later: from logged-in user
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

  // Event pill (RSVP in normal mode, edit/delete in manage mode)
  const renderEventCard = (event: RsvpEvent) => {
    const myRsvp = myRsvps[event.id]

    // RSVP status icon, label
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

    const eventDateObj = new Date(event.date)

    // COLORS MATCHING CALENDAR PILLS
    const baseLight =
      event.type === "game"
        ? "bg-[#EDE9FE]" // game purple light
        : event.type === "training"
          ? "bg-[#DBEAFE]" // training blue light
          : event.type === "analysis"
            ? "bg-[#DCFCE7]" // analysis green light
            : "bg-[#F5EDE3]" // other warm light

    const baseDark =
      event.type === "game"
        ? "bg-[#6D28D9]" // game purple dark
        : event.type === "training"
          ? "bg-[#3156ff]" // training blue dark
          : event.type === "analysis"
            ? "bg-[#16A34A]" // analysis green dark
            : "bg-[#A16207]" // other brown dark

    // Label text colors same as calendar (no pill background)
    const chipClasses =
      event.type === "training"
        ? "text-[#3156FF]"
        : event.type === "game"
          ? "text-[#6D28D9]"
          : event.type === "analysis"
            ? "text-[#16A34A]"
            : "text-[#A16207]"

    return (
      <div
        key={event.id}
        role={!isManaging ? "button" : undefined}
        tabIndex={!isManaging ? 0 : -1}
        onClick={() => {
          if (!isManaging) {
            setActiveRsvpEvent(event)
          }
        }}
        onKeyDown={e => {
          if (!isManaging && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault()
            setActiveRsvpEvent(event)
          }
        }}
        className={`relative w-full text-left outline-none ${
          isManaging ? "cursor-default" : "cursor-pointer"
        }`}
      >
        {/* Dark pill behind left arch */}
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
          {/* Main content row: left date, right all text (title, time, location, desc, footer) */}
          <div className="flex gap-3 md:gap-4">
            {/* LEFT: date block (NOV / 30) */}
            <div className="flex flex-col items-center justify-start px-2 pt-1">
              <span className="text-[12px] font-medium uppercase tracking-wide text-slate-600">
                {format(eventDateObj, "MMM")}
              </span>
              <span className="text-lg font-semibold leading-none text-slate-900">
                {format(eventDateObj, "d")}
              </span>
            </div>

            {/* RIGHT: title, time, location, description, footer */}
            <div className="flex-1">
              {/* Title + type + manage icons on same 'block' as rest of info */}
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-sm font-semibold text-slate-900 md:text-base">
                  {event.title || "Untitled event"}
                </h2>

                <div className="flex items-center gap-2">
                  <span
                    className={`
                      shrink-0 text-[11px] font-semibold uppercase tracking-wide mr-2 mt-1
                      ${chipClasses}
                    `}
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

              {/* Time, location, description */}
              <div className="mt-2 space-y-1.5 text-xs text-slate-600 md:text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    {format(eventDateObj, "EEEE")}, {event.time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{event.location || "Location to be decided"}</span>
                </div>
                <p className="mt-1 text-xs text-slate-700 md:text-sm">
                  {event.description || "Add description for this event"}
                </p>
              </div>

              {/* Divider, initials, status on right - aligned with text block */}
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-400 pt-3">
                {/* Left: user avatar, name */}
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-[16px] font-semibold text-slate-700">
                    {currentUserInitials}
                  </div>
                  <span className="text-sm text-slate-800 md:text-base">
                    {CURRENT_USER_NAME.split(" ")[0]}
                  </span>
                </div>

                {/* Right: RSVP status icon, label */}
                <div className="flex items-center gap-2 text-slate-700">
                  <StatusIcon className="h-5 w-5" />
                  <span className="text-xs font-medium md:text-sm">
                    {statusLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pt-2 pb-6">
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
          <p className="text-base text-slate-500">
            {isManaging
              ? "Manage and edit your events"
              : filter === "upcoming"
                ? "View all upcoming events"
                : "View all past events"}
          </p>
        </div>

        {CURRENT_USER_ROLE === "coach" && (
          <div className="mt-2 flex items-center gap-2">
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

            {/* Manage Events Toggle */}
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
