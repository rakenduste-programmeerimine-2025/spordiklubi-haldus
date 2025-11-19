"use client"

import { useState } from "react"
import { format, isSameDay } from "date-fns"
import { Clock, MapPin, X, ExternalLink } from "lucide-react"
import { MonthCalendar } from "./monthcalendar"

type Attendee = {
  id: number
  name: string
}

type ClubEvent = {
  id: number
  title: string
  date: string // "2025-11-19"
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
    date: "2025-11-19",
    time: "18:00",
    location: "Kuressaare kunstmuruväljak, talve 88a",
    description: "Focus on defense drills and team coordination",
    type: "training",
    attendees: [
      { id: 1, name: "Marko Saar" },
      { id: 2, name: "Anna Kask" },
      { id: 3, name: "Karl Parts" },
    ],
  },
  {
    id: 2,
    title: "League game vs FC Tartu",
    date: "2025-11-19",
    time: "19:30",
    location: "Kuressaare staadion",
    description: "Home game, meet at 18:30",
    type: "game",
    attendees: [
      { id: 1, name: "Marko Saar" },
      { id: 2, name: "Anna Kask" },
      { id: 3, name: "Karl Parts" },
      { id: 4, name: "Laura Vaher" },
      { id: 5, name: "Marek Tamm" },
    ],
  },
  {
    id: 3,
    title: "Video analysis",
    date: "2025-11-19",
    time: "20:30",
    location: "Club meeting room",
    description: "Review last match and set goals",
    type: "analysis",
    attendees: [
      { id: 1, name: "Marko Saar" },
      { id: 4, name: "Laura Vaher" },
    ],
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
      <section className="mt-6 space-y-2">
        {/* Title + subtitle */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Calendar</h1>
          <p className="text-sm text-slate-500">
            View all training sessions and games
          </p>
        </div>

        {/* Big card: two panels inside */}
        <div className="mt-4 flex flex-col gap-6 rounded-3xl bg-white p-6 shadow-md md:flex-row md:h-[420px]">
          {/* LEFT: calendar panel */}
          <div className="flex h-full items-center justify-center md:w-1/2">
            <MonthCalendar
              selectedDate={selectedDate}
              onChange={setSelectedDate}
              events={mockEvents.map(e => ({ date: e.date }))}
            />
          </div>

          {/* RIGHT: events panel with divider + scroll */}
          <div className="flex h-full flex-col md:w-1/2 md:border-l md:border-slate-200/70 md:pl-6">
            {/* Header (fixed, non-scrolling) */}
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                {format(selectedDate, "MMMM d, yyyy")}
              </p>

              <p className="mb-2 text-xs text-slate-400">
                {eventsForSelectedDay.length === 0
                  ? "No events scheduled"
                  : `${eventsForSelectedDay.length} event${
                      eventsForSelectedDay.length > 1 ? "s" : ""
                    } scheduled`}
              </p>
            </div>

            {/* Scrollable events list */}
            <div className="mt-2 space-y-3 overflow-y-auto pr-2">
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
                          ? "bg-[#FDBA74]" // darker orange
                          : event.type === "training"
                            ? "bg-[#93C5FD]" // darker blue
                            : event.type === "analysis"
                              ? "bg-[#6EE7B7]" // darker green
                              : "bg-[#3156ff]" // default
                      }
                    `}
                  />

                  {/* Light pill on top, slightly shifted right (type-based) */}
                  <div
                    className={`
                      relative ml-1.5 rounded-[40px] px-8 py-4 shadow-sm transition-transform hover:-translate-y-0.5
                      ${
                        event.type === "game"
                          ? "bg-[#FFF4E6]" // light orange
                          : event.type === "training"
                            ? "bg-[#EFF6FF]" // light blue
                            : event.type === "analysis"
                              ? "bg-[#ECFDF5]" // light green
                              : "bg-[#eef1ff]" // default light
                      }
                    `}
                  >
                    {/* Header row: title + type label */}
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold text-slate-900 truncate">
                        {event.title}
                      </h3>

                      <span
                        className={`
                          shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide
                          ${
                            event.type === "game"
                              ? "bg-[#FFE5C2] text-[#9A3412]" // orange
                              : event.type === "training"
                                ? "bg-[#DBEAFE] text-[#1D4ED8]" // blue
                                : event.type === "analysis"
                                  ? "bg-[#DCFCE7] text-[#15803D]" // green
                                  : "bg-slate-200 text-slate-700"
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
                <div className="mt-1 rounded-2xl border border-dashed border-slate-200 p-4 text-xs text-slate-400">
                  Click a date with a dot to see scheduled events.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Event details modal – BIGGER VERSION */}
      {activeEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg md:max-w-2xl rounded-3xl bg-white p-6 md:p-8 shadow-2xl">
            {/* Header */}
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs md:text-sm font-medium uppercase tracking-wide text-slate-400">
                  Event details
                </p>
                <h2 className="text-lg md:text-xl font-semibold text-slate-900">
                  {activeEvent.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setActiveEvent(null)}
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
                  {format(new Date(activeEvent.date), "MMMM d, yyyy")} at{" "}
                  {activeEvent.time}
                </span>
              </div>

              {/* Location row with small Maps icon button */}
              <div className="flex items-center gap-2 text-xs md:text-sm text-slate-500">
                <MapPin className="h-3.5 w-3.5 md:h-4 md:w-4" />

                <span className="truncate flex items-center gap-2">
                  {activeEvent.location}

                  <a
                    href={getMapsUrl(activeEvent.location)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-slate-500 hover:bg-slate-100 hover:text-slate-700 shrink-0"
                    aria-label="Open in Google Maps"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm md:text-base text-slate-700">
              {activeEvent.description}
            </div>

            {/* Attendance */}
            <div className="mt-5">
              <p className="text-xs md:text-sm font-medium text-slate-700">
                Attending ({activeEvent.attendees.length})
              </p>

              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {activeEvent.attendees.map(person => (
                  <div
                    key={person.id}
                    className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2"
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
            </div>
          </div>
        </div>
      )}
    </>
  )
}
