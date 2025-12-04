"use client"

import { useEffect, useMemo, useState } from "react"
import { format, isSameDay } from "date-fns"
import { Clock, MapPin, X, ExternalLink } from "lucide-react"
import { MonthCalendar } from "./monthcalendar"

//Helper Functions

function getInitials(nameOrEmail: string) {
  const base = nameOrEmail || ""
  return base
    .split(" ")
    .filter(Boolean)
    .map(part => part[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("")
}

// Format "21:00:00" → "21:00"
function formatTime(time: string | null) {
  if (!time) return ""
  return time.slice(0, 5)
}

// Format `date + time` → "Friday, 21:00"
function formatDayTime(date: string, time: string | null) {
  const day = format(new Date(date), "EEEE")
  const t = formatTime(time)
  return `${day}, ${t}`
}

function getMapsUrl(location: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    location,
  )}`
}

//Types

type EventTypeKey = "training" | "game" | "analysis" | "other"

const EVENT_TYPE_ID_TO_KEY: Record<number, EventTypeKey> = {
  1: "training",
  2: "game",
  3: "analysis",
  4: "other",
}

type EventApiRow = {
  id: number
  title: string
  description: string
  date: string
  start_time: string
  end_time: string | null
  location: string
  event_type_id: number
  club_id: number
  created_by: string
  created_at: string
  updated_at: string | null
}

type CalendarEvent = {
  id: number
  title: string
  description: string
  date: string
  start_time: string
  end_time: string | null
  location: string
  event_type_id: number
  type: EventTypeKey
}

type RoleName = "coach" | "player"

type ProfileClub = {
  id: number
  name: string
  logo: string | null
  slug: string
}

type ProfileResponse = {
  id: string
  name: string
  email: string
  role: RoleName
  club: ProfileClub | null
}

type RsvpStatus = "going" | "not_going" | "maybe"

type RsvpProfile = {
  status: RsvpStatus
  note: string | null
  profile: {
    id: string
    name: string | null
    email: string
    role?: { name: string } | null
  }
}

type RsvpGroups = {
  going: RsvpProfile[]
  not_going: RsvpProfile[]
  maybe: RsvpProfile[]
}

//Main Component

export function ClubCalendar() {
  const [profile, setProfile] = useState<ProfileResponse | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileError, setProfileError] = useState<string | null>(null)

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [eventsLoading, setEventsLoading] = useState(false)
  const [eventsError, setEventsError] = useState<string | null>(null)
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null)

  const clubId = profile?.club?.id ?? null

  //Load profile

  useEffect(() => {
    let cancelled = false

    async function loadProfile() {
      try {
        setProfileLoading(true)
        setProfileError(null)

        const res = await fetch("/api/profile")
        if (!res.ok) throw new Error(`Failed to load profile (${res.status})`)

        const data = (await res.json()) as ProfileResponse
        if (!cancelled) setProfile(data)
      } catch (err: unknown) {
        if (!cancelled) {
          setProfileError(
            err instanceof Error ? err.message : "Failed to load profile",
          )
        }
      } finally {
        if (!cancelled) setProfileLoading(false)
      }
    }

    loadProfile()
    return () => {
      cancelled = true
    }
  }, [])

  //Load events

  useEffect(() => {
    if (!clubId) return

    let cancelled = false

    async function loadEvents() {
      try {
        setEventsLoading(true)
        setEventsError(null)

        const res = await fetch(`/api/events?clubId=${clubId}`)
        if (!res.ok) throw new Error(`Failed to load events (${res.status})`)

        const rows = (await res.json()) as EventApiRow[]
        if (cancelled) return

        const mapped: CalendarEvent[] = rows.map(e => ({
          id: e.id,
          title: e.title,
          description: e.description,
          date: e.date,
          start_time: e.start_time,
          end_time: e.end_time,
          location: e.location,
          event_type_id: e.event_type_id,
          type: EVENT_TYPE_ID_TO_KEY[e.event_type_id] ?? "other",
        }))

        setEvents(mapped)
      } catch (err: unknown) {
        if (!cancelled) {
          setEventsError(
            err instanceof Error ? err.message : "Failed to load events",
          )
        }
      } finally {
        if (!cancelled) setEventsLoading(false)
      }
    }

    loadEvents()
    return () => {
      cancelled = true
    }
  }, [clubId])

  //Events for selected date

  const eventsForSelectedDay = useMemo(
    () => events.filter(e => isSameDay(new Date(e.date), selectedDate)),
    [events, selectedDate],
  )

  const isLoading = profileLoading || eventsLoading
  const hasError = profileError || eventsError

  //UI

  return (
    <>
      <section className="-mt-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Calendar</h1>
          <p className="text-slate-600">
            View all trainings, games & other events
          </p>
        </div>

        {hasError && (
          <p className="mt-3 text-sm text-red-500">
            {profileError ?? eventsError}
          </p>
        )}

        {/* Card layout */}
        <div className="mt-6 flex flex-col gap-6 rounded-[32px] bg-white p-6 shadow-md md:flex-row md:h-[420px]">
          {/* Left panel */}
          <div className="flex h-full items-center justify-center md:w-1/2">
            <MonthCalendar
              selectedDate={selectedDate}
              onChange={setSelectedDate}
              events={events.map(e => ({ date: e.date }))}
            />
          </div>

          {/* Right panel */}
          <div className="flex h-full flex-col md:w-1/2 md:border-l md:border-slate-200/70 md:pl-6">
            <div>
              <p className="text-base font-medium text-slate-900 uppercase tracking-wide">
                {format(selectedDate, "MMMM d, yyyy")}
              </p>

              {isLoading ? (
                <p className="mb-2 text-sm text-slate-500">Loading events…</p>
              ) : (
                <p className="mb-2 text-sm text-slate-700">
                  {eventsForSelectedDay.length === 0
                    ? "No events scheduled"
                    : `${eventsForSelectedDay.length} event${
                        eventsForSelectedDay.length > 1 ? "s" : ""
                      } scheduled`}
                </p>
              )}
            </div>

            {/* Scrollable event list */}
            <div className="mt-2 space-y-3 overflow-y-auto pr-[14px] scrollbar-none">
              {!isLoading &&
                eventsForSelectedDay.map(event => (
                  <button
                    key={event.id}
                    onClick={() => setActiveEvent(event)}
                    className="relative w-full text-left focus:outline-none"
                  >
                    <div
                      className={`
                        pointer-events-none absolute inset-0 rounded-[40px]
                        ${
                          event.type === "game"
                            ? "bg-[#6D28D9]"
                            : event.type === "training"
                              ? "bg-[#3156ff]"
                              : event.type === "analysis"
                                ? "bg-[#16A34A]"
                                : "bg-[#A16207]"
                        }
                      `}
                    />

                    <div
                      className={`
                        relative ml-1.5 rounded-[40px] px-8 py-4 shadow-sm transition-transform hover:-translate-y-0.5
                        ${
                          event.type === "game"
                            ? "bg-[#EDE9FE]"
                            : event.type === "training"
                              ? "bg-[#DBEAFE]"
                              : event.type === "analysis"
                                ? "bg-[#DCFCE7]"
                                : "bg-[#F5EDE3]"
                        }
                      `}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm font-semibold text-slate-900 truncate">
                          {event.title}
                        </h3>

                        <span
                          className={`
                            text-[11px] font-semibold uppercase tracking-wide
                            ${
                              event.type === "training"
                                ? "text-[#3156FF]"
                                : event.type === "game"
                                  ? "text-[#6D28D9]"
                                  : event.type === "analysis"
                                    ? "text-[#16A34A]"
                                    : "text-[#A16207]"
                            }
                          `}
                        >
                          {event.type}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-col gap-1 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            {formatDayTime(event.date, event.start_time)}
                            {event.end_time
                              ? `–${formatTime(event.end_time)}`
                              : ""}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{event.location}</span>
                        </div>
                      </div>

                      <p className="pt-2 text-xs text-slate-600 line-clamp-2">
                        {event.description}
                      </p>
                    </div>
                  </button>
                ))}

              {!isLoading && eventsForSelectedDay.length === 0 && (
                <div className="mt-1 rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-700">
                  Click a date with a dot to see scheduled events.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {activeEvent && (
        <EventDetailsModal
          event={activeEvent}
          onClose={() => setActiveEvent(null)}
        />
      )}
    </>
  )
}

//Modal

type EventDetailsModalProps = {
  event: CalendarEvent
  onClose: () => void
}

function EventDetailsModal({ event, onClose }: EventDetailsModalProps) {
  const [rsvps, setRsvps] = useState<RsvpGroups | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadRsvps() {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`/api/events/${event.id}/rsvp`)
        if (!res.ok) throw new Error(`Failed to load RSVPs (${res.status})`)

        const data = (await res.json()) as RsvpGroups
        if (!cancelled) setRsvps(data)
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load RSVPs")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadRsvps()
    return () => {
      cancelled = true
    }
  }, [event.id])

  const going = rsvps?.going ?? []
  const notGoing = rsvps?.not_going ?? []
  const maybe = rsvps?.maybe ?? []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg md:max-w-2xl rounded-3xl bg-white p-6 md:p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-xs md:text-sm font-medium uppercase tracking-wide text-slate-400">
              Event details
            </p>
            <h2 className="text-lg md:text-xl font-semibold text-slate-900">
              {event.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        </div>

        {/* Meta */}
        <div className="space-y-2 text-sm md:text-base text-slate-700">
          <div className="flex items-center gap-2 text-xs md:text-sm text-slate-500">
            <Clock className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span>
              {format(new Date(event.date), "MMMM d, yyyy")} at{" "}
              {formatTime(event.start_time)}
              {event.end_time ? `–${formatTime(event.end_time)}` : ""}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs md:text-sm text-slate-500">
            <MapPin className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span className="truncate flex items-center gap-2">
              {event.location}

              <a
                href={getMapsUrl(event.location)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-slate-500 hover:bg-slate-100 hover:text-slate-700 shrink-0"
                aria-label="Open in Google Maps"
              >
                <ExternalLink className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </a>
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm md:text-base text-slate-700">
          {event.description}
        </div>

        {/* RSVPs */}
        <div className="mt-6">
          {loading && (
            <p className="text-sm text-slate-500">Loading attendees…</p>
          )}

          {error && (
            <p className="text-sm text-red-500">
              Failed to load attendees – please try again.
            </p>
          )}

          {!loading && !error && (
            <div className="max-h-64 md:max-h-72 overflow-y-auto space-y-4 scrollbar-none">
              {going.length > 0 && (
                <RsvpSection
                  label="Going"
                  items={going}
                />
              )}
              {notGoing.length > 0 && (
                <RsvpSection
                  label="Not going"
                  items={notGoing}
                />
              )}
              {maybe.length > 0 && (
                <RsvpSection
                  label="Maybe"
                  items={maybe}
                />
              )}

              {going.length === 0 &&
                notGoing.length === 0 &&
                maybe.length === 0 && (
                  <p className="text-xs md:text-sm text-slate-500">
                    No RSVPs yet.
                  </p>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// RSVP Section

type RsvpSectionProps = {
  label: string
  items: RsvpProfile[]
}

function RsvpSection({ label, items }: RsvpSectionProps) {
  return (
    <section>
      <p className="text-xs md:text-sm font-medium text-slate-700 mb-2">
        {label} ({items.length})
      </p>

      <div className="grid gap-2 md:grid-cols-2 pr-[14px]">
        {items.map(item => {
          const name =
            item.profile?.name || item.profile?.email || "Unnamed attendee"

          return (
            <div
              key={item.profile.id}
              className="flex w-full items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-[11px] md:text-xs font-semibold text-slate-700">
                {getInitials(name)}
              </div>

              <div className="flex flex-col">
                <span className="text-xs md:text-sm text-slate-800">
                  {name}
                </span>

                {item.note && (
                  <span className="text-[11px] md:text-xs text-slate-500">
                    {item.note}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
