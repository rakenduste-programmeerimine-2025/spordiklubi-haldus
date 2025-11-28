"use client"

import { useMemo, useState } from "react"
import {
  addDays,
  addMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameDay,
  isSameMonth,
  format,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"

type ClubEvent = {
  date: string
}

type MonthCalendarProps = {
  selectedDate: Date
  onChange: (date: Date) => void
  events?: ClubEvent[]
}

export function MonthCalendar({
  selectedDate,
  onChange,
  events = [],
}: MonthCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate))

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 })
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

    const temp: Date[] = []
    let day = gridStart
    while (day <= gridEnd) {
      temp.push(day)
      day = addDays(day, 1)
    }
    return temp
  }, [currentMonth])

  const hasEventsOn = (day: Date) =>
    events.some(e => isSameDay(new Date(e.date), day))

  const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  return (
    <div className="rounded-[32px] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,.08)] border border-slate-100">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCurrentMonth(m => addMonths(m, -1))}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-slate-600 shadow-sm ring-1 ring-slate-200/60 backdrop-blur-sm transition hover:bg-white hover:-translate-y-0.5"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="text-lg font-semibold text-slate-900 tracking-wide">
          {format(currentMonth, "MMMM yyyy")}
        </div>

        <button
          type="button"
          onClick={() => setCurrentMonth(m => addMonths(m, 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-slate-600 shadow-sm ring-1 ring-slate-200/60 backdrop-blur-sm transition hover:bg-white hover:-translate-y-0.5"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Weekday row */}
      <div className="mb-2 grid grid-cols-7 text-center text-sm text-slate-400">
        {weekdayLabels.map(d => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-y-1 text-sm">
        {days.map(day => {
          const inMonth = isSameMonth(day, currentMonth)
          const isSelected = isSameDay(day, selectedDate)
          const isToday = isSameDay(day, new Date())
          const showEventDot = hasEventsOn(day)

          let circleClasses =
            "relative flex h-10 w-10 items-center justify-center rounded-full text-sm transition transform"

          if (!inMonth) circleClasses += " text-slate-300"
          else circleClasses += " text-slate-700"

          if (isSelected)
            circleClasses +=
              " bg-blue-600 text-white shadow-[0_10px_25px_rgba(37,99,235,.45)] scale-[1.02]"
          else if (isToday)
            circleClasses +=
              " bg-white text-blue-700 ring-1 ring-blue-400/70 shadow-[0_0_0_1px_rgba(96,165,250,.4)]"
          else if (inMonth)
            circleClasses +=
              " hover:bg-white/80 hover:shadow-[0_6px_16px_rgba(148,163,184,.35)] hover:-translate-y-0.5"

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => {
                onChange(day)
                setCurrentMonth(startOfMonth(day))
              }}
              className="flex items-center justify-center"
            >
              <div className={circleClasses}>
                {format(day, "d")}
                {showEventDot && (
                  <span className="absolute bottom-[3px] h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_0_2px_rgba(219,234,254,1)]" />
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
