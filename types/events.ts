// lib/types/events.ts

// RSVP statuses
export type RsvpStatus = "going" | "not_going" | "maybe"

// Single RSVP entry (one member)
export type RsvpProfile = {
  status: RsvpStatus
  note: string | null
  profile: {
    id: string
    name: string
    email: string
    role: {
      name: string
    } | null
  } | null
}

// Grouped RSVP response for UI
export type RsvpGrouped = {
  going: RsvpProfile[]
  not_going: RsvpProfile[]
  maybe: RsvpProfile[]
}

// Event row type (what your API returns after SELECT)
export type EventType = {
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
  updated_at: string
}
