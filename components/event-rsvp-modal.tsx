"use client"

import { useState, useEffect } from "react"
import { Clock, MapPin, X } from "lucide-react"
import { format } from "date-fns"
import { type RsvpStatus, type RsvpGrouped } from "@/types/events"

// Re-export so the rest of your app can still import from this file
export type RSVPStatus = RsvpStatus

export type RsvpAttendee = {
  id: string
  name: string
  status: RSVPStatus
  note?: string
}

export type RsvpEvent = {
  id: number
  title: string
  date: string
  time: string
  location: string
  description: string
  type: "training" | "game" | "analysis" | "other"
  attendees: RsvpAttendee[] // kept for API, but we now fetch live RSVPs
}

type EventRsvpModalProps = {
  event: RsvpEvent
  isOpen: boolean
  onClose: () => void
  onSave?: (data: { status: RSVPStatus; note: string }) => void
  currentUserRole?: "coach" | "player"
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map(part => part[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("")
}

export function EventRsvpModal({
  event,
  isOpen,
  onClose,
  onSave,
  currentUserRole = "coach",
}: EventRsvpModalProps) {
  const [status, setStatus] = useState<RSVPStatus | null>(null)
  const [note, setNote] = useState("")
  const [attendees, setAttendees] = useState<RsvpAttendee[]>([])
  const [isLoadingRsvps, setIsLoadingRsvps] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  //Lock body scroll while modal is open
  useEffect(() => {
    if (!isOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen])

  // Load RSVPs from backend when modal opens
  useEffect(() => {
    if (!isOpen) return

    const fetchRsvps = async () => {
      setIsLoadingRsvps(true)
      try {
        const res = await fetch(`/api/events/${event.id}/rsvp`)
        if (!res.ok) {
          console.error("Failed to fetch RSVPs", event.id, await res.text())
          return
        }

        const data = (await res.json()) as RsvpGrouped

        const flattened: RsvpAttendee[] = [
          ...data.going.map(r => ({
            id: r.profile?.id ?? `unknown-going-${Math.random()}`,
            name: r.profile?.name ?? "Unknown player",
            status: "going" as RSVPStatus,
            note: r.note ?? undefined,
          })),
          ...data.not_going.map(r => ({
            id: r.profile?.id ?? `unknown-not-going-${Math.random()}`,
            name: r.profile?.name ?? "Unknown player",
            status: "not_going" as RSVPStatus,
            note: r.note ?? undefined,
          })),
          ...data.maybe.map(r => ({
            id: r.profile?.id ?? `unknown-maybe-${Math.random()}`,
            name: r.profile?.name ?? "Unknown player",
            status: "maybe" as RSVPStatus,
            note: r.note ?? undefined,
          })),
        ]

        setAttendees(flattened)
      } catch (err) {
        console.error("Error fetching RSVPs", err)
      } finally {
        setIsLoadingRsvps(false)
      }
    }

    // reset local selection when opening
    setStatus(null)
    setNote("")
    fetchRsvps()
  }, [isOpen, event.id])

  if (!isOpen) return null

  const going = attendees.filter(a => a.status === "going")
  const notGoing = attendees.filter(a => a.status === "not_going")
  const maybe = attendees.filter(a => a.status === "maybe")

  const handleSave = async () => {
    if (!status) return

    try {
      setIsSaving(true)

      const res = await fetch(`/api/events/${event.id}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note }),
      })

      if (!res.ok) {
        console.error("Failed to save RSVP", event.id, await res.text())
        setIsSaving(false)
        return
      }

      // Let parent update its own "myRsvps" state for status pill
      onSave?.({ status, note })

      // Optionally could re-fetch RSVPs here to immediately include yourself in the list
      // but since you'll normally close the modal, it's not critical.

      onClose()
    } catch (err) {
      console.error("Error saving RSVP", err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg md:max-w-2xl rounded-3xl bg-white p-6 md:p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs md:text-sm font-medium uppercase tracking-wide text-slate-400">
              RSVP to event
            </p>
            <h2 className="text-lg md:text-2xl font-semibold text-slate-900">
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
            <span>{event.location}</span>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm md:text-base text-slate-700">
          {event.description}
        </div>

        {/* RSVP buttons */}
        <div className="mt-5">
          <p className="text-xs md:text-sm font-medium text-slate-700 mb-3">
            Your response
          </p>

          <div className="flex flex-wrap gap-2">
            {(["going", "not_going", "maybe"] as RSVPStatus[]).map(option => (
              <button
                key={option}
                type="button"
                onClick={() => setStatus(option)}
                className={`
                  rounded-full px-4 py-2 text-xs md:text-sm font-medium border
                  ${
                    status === option
                      ? "border-[#3156ff] bg-[#eef1ff] text-[#3156ff]"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }
                `}
              >
                {option === "going"
                  ? "Going"
                  : option === "not_going"
                    ? "Not going"
                    : "Maybe"}
              </button>
            ))}
          </div>

          {(status === "not_going" || status === "maybe") && (
            <div className="mt-4">
              <p className="text-xs md:text-sm font-medium text-slate-700 mb-2">
                Note to coach (optional)
              </p>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder='E.g. "Sick, have fever"'
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-[#3156ff] focus:outline-none focus:ring-1 focus:ring-[#3156ff]"
                rows={3}
              />
            </div>
          )}
        </div>

        {/* Attendance lists */}
        <div className="mt-6">
          <div className="max-h-64 md:max-h-72 overflow-y-auto scrollbar-none space-y-4 pr-[14px]">
            {isLoadingRsvps ? (
              <p className="text-xs text-slate-400">Loading responses...</p>
            ) : (
              <>
                {/* Going */}
                <div>
                  <p className="text-xs md:text-sm font-medium text-slate-700">
                    Going ({going.length})
                  </p>
                  {going.length === 0 ? (
                    <p className="mt-2 text-xs text-slate-400">
                      No players marked as going yet.
                    </p>
                  ) : (
                    <div className="mt-2 grid gap-2 md:grid-cols-2">
                      {going.map(person => (
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
                  )}
                </div>

                {/* Not going */}
                <div>
                  <p className="text-xs md:text-sm font-medium text-slate-700">
                    Not going ({notGoing.length})
                  </p>
                  {notGoing.length === 0 ? (
                    <p className="mt-2 text-xs text-slate-400">
                      No players marked as not going.
                    </p>
                  ) : (
                    <div className="mt-2 grid gap-2 md:grid-cols-2">
                      {notGoing.map(person => (
                        <div
                          key={person.id}
                          className="flex flex-col gap-1 rounded-2xl bg-slate-50 px-3 py-2"
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-[11px] md:text-xs font-semibold text-slate-700">
                              {getInitials(person.name)}
                            </div>
                            <span className="text-xs md:text-sm text-slate-800">
                              {person.name}
                            </span>
                          </div>

                          {currentUserRole === "coach" && person.note && (
                            <p className="pl-10 text-[11px] md:text-xs text-slate-500">
                              “{person.note}”
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Maybe */}
                <div>
                  <p className="text-xs md:text-sm font-medium text-slate-700">
                    Maybe ({maybe.length})
                  </p>
                  {maybe.length === 0 ? (
                    <p className="mt-2 text-xs text-slate-400">
                      No players marked as maybe.
                    </p>
                  ) : (
                    <div className="mt-2 grid gap-2 md:grid-cols-2">
                      {maybe.map(person => (
                        <div
                          key={person.id}
                          className="flex flex-col gap-1 rounded-2xl bg-slate-50 px-3 py-2"
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-[11px] md:text-xs font-semibold text-slate-700">
                              {getInitials(person.name)}
                            </div>
                            <span className="text-xs md:text-sm text-slate-800">
                              {person.name}
                            </span>
                          </div>

                          {currentUserRole === "coach" && person.note && (
                            <p className="pl-10 text-[11px] md:text-xs text-slate-500">
                              “{person.note}”
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={!status || isSaving}
            className="rounded-full bg-[#3156ff] px-5 py-2 text-sm font-semibold text-white hover:bg-[#2342d6] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save response"}
          </button>
        </div>
      </div>
    </div>
  )
}
