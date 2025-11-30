"use client"

import { useState } from "react"
import { format, isSameDay } from "date-fns"
import { Clock, MapPin, X, ExternalLink } from "lucide-react"
import { MonthCalendar } from "./monthcalendar"

type AttendanceStatus = "going" | "not_going" | "maybe"

type Attendee = {
  id: number
  name: string
  status: AttendanceStatus
}

type ClubEvent = {
  id: number
  title: string
  date: string // "2025-11-28"
  time: string
  location: string
  description: string
  type: "training" | "game" | "analysis" | "other"
  attendees: Attendee[]
}

const mockEvents: ClubEvent[] = [
  {
    id: 1,
    title: "Team training",
    date: "2025-11-28",
    time: "18:00",
    location: "Kuressaare kunstmuruväljak, talve 88a",
    description: "Focus on defense drills and team coordination",
    type: "training",
    attendees: [
      // 20 going
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
      { id: 21, name: "Martin Sepp", status: "not_going" },
      { id: 22, name: "Kelli Piir", status: "not_going" },
      { id: 23, name: "Helen Kuus", status: "not_going" },
      { id: 24, name: "Taavi Rannamäe", status: "not_going" },
      { id: 25, name: "Anet Kuut", status: "not_going" },

      // 2 maybe
      { id: 26, name: "Karl-Erik Tamm", status: "maybe" },
      { id: 27, name: "Pille Saar", status: "maybe" },
    ],
  },
  {
    id: 2,
    title: "League game vs FC Tartu",
    date: "2025-11-28",
    time: "19:30",
    location: "Kuressaare staadion",
    description: "Home game, meet at 18:30",
    type: "game",
    attendees: [
      { id: 1, name: "Marko Saar", status: "going" },
      { id: 2, name: "Anna Kask", status: "going" },
      { id: 3, name: "Karl Parts", status: "going" },
      { id: 4, name: "Laura Vaher", status: "maybe" },
      { id: 5, name: "Marek Tamm", status: "not_going" },
    ],
  },
  {
    id: 3,
    title: "Video analysis",
    date: "2025-11-28",
    time: "20:30",
    location: "Club meeting room",
    description: "Review last match and set goals",
    type: "analysis",
    attendees: [
      { id: 1, name: "Marko Saar", status: "going" },
      { id: 4, name: "Laura Vaher", status: "going" },
      { id: 5, name: "Marek Tamm", status: "maybe" },
    ],
  },
  {
    id: 4,
    title: "Team bonding activity",
    date: "2025-11-28",
    time: "21:00",
    location: "Bowling hall, Kuressaare Keskus",
    description: "Casual team bonding session to improve chemistry.",
    type: "other",
    attendees: [],
  },
]

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map(part => part[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("")
}

// Linking button to google maps, taking location text
function getMapsUrl(location: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    location,
  )}`
}

export function ClubCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [activeEvent, setActiveEvent] = useState<ClubEvent | null>(null)

  const eventsForSelectedDay = mockEvents.filter(event =>
    isSameDay(new Date(event.date), selectedDate),
  )

  return (
    <>
      <section className="-mt-4">
        {/* Title, subtitle */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Calendar</h1>
          <p className="text-slate-600">View all training sessions and games</p>
        </div>

        {/* Big card: two panels inside */}
        <div className="mt-6 flex flex-col gap-6 rounded-[32px] bg-white p-6 shadow-md md:flex-row md:h-[420px]">
          {/* Left: calendar panel */}
          <div className="flex h-full items-center justify-center md:w-1/2">
            <MonthCalendar
              selectedDate={selectedDate}
              onChange={setSelectedDate}
              events={mockEvents.map(e => ({ date: e.date }))}
            />
          </div>

          {/* Right: events panel with divider, scroll */}
          <div className="flex h-full flex-col md:w-1/2 md:border-l md:border-slate-200/70 md:pl-6">
            {/* Header (fixed, non-scrolling) */}
            <div>
              <p className="text-base font-medium text-slate-900 uppercase tracking-wide">
                {format(selectedDate, "MMMM d, yyyy")}
              </p>

              <p className="mb-2 text-sm text-slate-700">
                {eventsForSelectedDay.length === 0
                  ? "No events scheduled"
                  : `${eventsForSelectedDay.length} event${
                      eventsForSelectedDay.length > 1 ? "s" : ""
                    } scheduled`}
              </p>
            </div>

            {/* Scrollable events list */}
            <div className="mt-2 space-y-3 overflow-y-auto pr-[14px] scrollbar-none">
              {eventsForSelectedDay.map(event => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => setActiveEvent(event)}
                  className="relative w-full text-left focus:outline-none"
                >
                  {/* Darker pill behind (type-based) */}
                  <div
                    className={`
                      pointer-events-none absolute inset-0 rounded-[40px]
                      ${
                        event.type === "game"
                          ? "bg-[#6D28D9]" // game purple dark
                          : event.type === "training"
                            ? "bg-[#3156ff]" // training blue dark
                            : event.type === "analysis"
                              ? "bg-[#16A34A]" // analysis green dark
                              : "bg-[#A16207]" // other brown dark
                      }
                    `}
                  />

                  {/* Light pill on top, slightly shifted right (type-based) */}
                  <div
                    className={`
                      relative ml-1.5 rounded-[40px] px-8 py-4 shadow-sm transition-transform hover:-translate-y-0.5
                      ${
                        event.type === "game"
                          ? "bg-[#EDE9FE]" // game purple light
                          : event.type === "training"
                            ? "bg-[#DBEAFE]" // training blue light
                            : event.type === "analysis"
                              ? "bg-[#DCFCE7]" // analysis green light
                              : "bg-[#F5EDE3]" // other warm light
                      }
                    `}
                  >
                    {/* Header row: title, type label */}
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold text-slate-900 truncate">
                        {event.title}
                      </h3>

                      {/* Simple colored text label (no pill) */}
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
                        <span>{event.time}</span>
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

              {eventsForSelectedDay.length === 0 && (
                <div className="mt-1 rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-700">
                  Click a date with a dot to see scheduled events.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Event details modal */}
      {activeEvent && (
        <EventDetailsModal
          event={activeEvent}
          onClose={() => setActiveEvent(null)}
        />
      )}
    </>
  )
}

type EventDetailsModalProps = {
  event: ClubEvent
  onClose: () => void
}

function EventDetailsModal({ event, onClose }: EventDetailsModalProps) {
  const going = event.attendees.filter(a => a.status === "going")
  const notGoing = event.attendees.filter(a => a.status === "not_going")
  const maybe = event.attendees.filter(a => a.status === "maybe")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg md:max-w-2xl rounded-3xl bg-white p-6 md:p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs md:text-sm font-medium uppercase tracking-wide text-slate-400">
              Event details
            </p>
            <h2 className="text-lg md:text-xl font-semibold text-slate-900">
              {event.title}
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

        {/* Meta */}
        <div className="space-y-2 text-sm md:text-base text-slate-700">
          <div className="flex items-center gap-2 text-xs md:text-sm text-slate-500">
            <Clock className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span>
              {format(new Date(event.date), "MMMM d, yyyy")} at {event.time}
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

        {/* Going / Not going / Maybe */}
        <div className="mt-6">
          <div className="max-h-64 md:max-h-72 overflow-y-auto scrollbar-none space-y-4">
            {going.length > 0 && (
              <section>
                <p className="text-xs md:text-sm font-medium text-slate-700 mb-2">
                  Going ({going.length})
                </p>
                <div className="grid gap-2 md:grid-cols-2 pr-[14px]">
                  {going.map(person => (
                    <div
                      key={person.id}
                      className="flex w-full items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-[11px] md:text-xs font-semibold text-slate-700">
                        {getInitials(person.name)}
                      </div>
                      <span className="text-xs md:text-sm text-slate-800">
                        {person.name}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {notGoing.length > 0 && (
              <section>
                <p className="text-xs md:text-sm font-medium text-slate-700 mb-2">
                  Not going ({notGoing.length})
                </p>
                <div className="grid gap-2 md:grid-cols-2 pr-[14px]">
                  {notGoing.map(person => (
                    <div
                      key={person.id}
                      className="flex w-full items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-[11px] md:text-xs font-semibold text-slate-700">
                        {getInitials(person.name)}
                      </div>
                      <span className="text-xs md:text-sm text-slate-800">
                        {person.name}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {maybe.length > 0 && (
              <section>
                <p className="text-xs md:text-sm font-medium text-slate-700 mb-2">
                  Maybe ({maybe.length})
                </p>
                <div className="grid gap-2 md:grid-cols-2 pr-[14px]">
                  {maybe.map(person => (
                    <div
                      key={person.id}
                      className="flex w-full items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-[11px] md:text-xs font-semibold text-slate-700">
                        {getInitials(person.name)}
                      </div>
                      <span className="text-xs md:text-sm text-slate-800">
                        {person.name}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
