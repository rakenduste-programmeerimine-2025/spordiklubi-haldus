"use client"

import { useEffect, useState } from "react"
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
import { type EventType } from "@/types/events"

// TODO: replace with real active club/team id from context/router/profile
const CLUB_ID = 1

type MyRsvp = {
  status: RSVPStatus
  note: string
}

// Map between DB event_type_id and UI event.type
// Adjust these IDs to match your `event_type` table in the DB
const EVENT_TYPE_ID_TO_KEY: Record<number, RsvpEvent["type"]> = {
  1: "training",
  2: "game",
  3: "analysis",
  4: "other",
}

const EVENT_TYPE_KEY_TO_ID: Record<RsvpEvent["type"], number> = {
  training: 1,
  game: 2,
  analysis: 3,
  other: 4,
}

// later: from logged-in user / profile
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
  const [events, setEvents] = useState<RsvpEvent[]>([])
  const [myRsvps, setMyRsvps] = useState<Record<number, MyRsvp>>({})
  const [filter, setFilter] = useState<EventFilter>("upcoming")
  const [isManaging, setIsManaging] = useState(false)

  const [activeRsvpEvent, setActiveRsvpEvent] = useState<RsvpEvent | null>(null)
  const [editingEvent, setEditingEvent] = useState<RsvpEvent | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const currentUserInitials = getInitials(CURRENT_USER_NAME)

  // --- Helpers to map between API events and UI events ---

  function mapApiEventToUi(event: EventType): RsvpEvent {
    const type =
      EVENT_TYPE_ID_TO_KEY[event.event_type_id] ??
      ("other" as RsvpEvent["type"])

    return {
      id: event.id,
      title: event.title,
      date: event.date, // date column (YYYY-MM-DD)
      time: event.start_time?.slice(0, 5) ?? "00:00",
      location: event.location,
      description: event.description,
      type,
      attendees: [], // RSVP data handled by EventRsvpModal via /rsvp endpoint
    }
  }

  function buildApiPayloadFromUi(ev: RsvpEvent) {
    const event_type_id = EVENT_TYPE_KEY_TO_ID[ev.type] ?? 4

    return {
      title: ev.title,
      description: ev.description,
      date: ev.date,
      start_time: ev.time,
      end_time: null, // you can extend UI later to handle end time
      location: ev.location,
      event_type_id,
      club_id: CLUB_ID,
    }
  }

  // --- Load events from API ---

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/events?clubId=${CLUB_ID}`)
        if (!res.ok) {
          console.error("Failed to fetch events", await res.text())
          return
        }

        const data = (await res.json()) as EventType[]
        const uiEvents = data.map(mapApiEventToUi)
        setEvents(uiEvents)
      } catch (err) {
        console.error("Error fetching events", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // --- RSVP handling (still local for now, backend already ready) ---

  const handleSaveRsvp = (
    eventId: number,
    data: { status: RSVPStatus; note: string },
  ) => {
    setMyRsvps(prev => ({
      ...prev,
      [eventId]: data,
    }))
    // TODO: we already have /api/events/:id/rsvp POST – call it from EventRsvpModal
  }

  // --- Event CRUD ---

  const handleDeleteEvent = async (eventId: number) => {
    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        console.error("Failed to delete event", await res.text())
        return
      }

      setEvents(prev => prev.filter(e => e.id !== eventId))
    } catch (err) {
      console.error("Error deleting event", err)
    }
  }

  const handleAddEvent = () => {
    const blankEvent: RsvpEvent = {
      id: 0, // temporary; real id comes from DB on create
      title: "",
      date: format(new Date(), "yyyy-MM-dd"),
      time: "18:00",
      location: "",
      description: "",
      type: "training",
      attendees: [],
    }

    setIsCreating(true)
    setEditingEvent(blankEvent)
  }

  const handleSaveEvent = async (updated: RsvpEvent) => {
    try {
      if (isCreating) {
        // CREATE
        const payload = buildApiPayloadFromUi(updated)

        const res = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          console.error("Failed to create event", await res.text())
          return
        }

        const created = (await res.json()) as EventType
        const uiEvent = mapApiEventToUi(created)

        setEvents(prev => [...prev, uiEvent])
      } else {
        // UPDATE
        const payload = buildApiPayloadFromUi(updated)

        const res = await fetch(`/api/events/${updated.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          console.error("Failed to update event", await res.text())
          return
        }

        const saved = (await res.json()) as EventType
        const uiEvent = mapApiEventToUi(saved)

        setEvents(prev => prev.map(e => (e.id === uiEvent.id ? uiEvent : e)))
      }
    } catch (err) {
      console.error("Error saving event", err)
    } finally {
      setEditingEvent(null)
      setIsCreating(false)
    }
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
        {isLoading ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
            Loading events...
          </div>
        ) : filteredEvents.length === 0 ? (
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
