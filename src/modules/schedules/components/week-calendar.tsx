"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getWeekDates, getDayNameShort } from "../lib/schedule-utils"
import { getWeekSessions } from "../actions/session-actions"
import { ClassCard } from "./class-card"
import type { ClassSessionWithDetails } from "../types"

interface WeekCalendarProps {
  showBookButton?: boolean
}

export function WeekCalendar({ showBookButton = false }: WeekCalendarProps) {
  const [weekOffset, setWeekOffset] = useState(0)
  const [sessions, setSessions] = useState<ClassSessionWithDetails[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getWeekSessions(weekOffset).then((data) => {
      setSessions(data)
      setLoading(false)
    })
  }, [weekOffset])

  const weekDates = getWeekDates(
    new Date(Date.now() + weekOffset * 7 * 24 * 60 * 60 * 1000)
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setWeekOffset((w) => w - 1)}
          className="rounded-lg p-2 hover:bg-muted transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="text-sm font-medium">
          {weekDates[0].toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
          {" — "}
          {weekDates[6].toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
        </div>
        <button
          onClick={() => setWeekOffset((w) => w + 1)}
          className="rounded-lg p-2 hover:bg-muted transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
          {weekDates.map((date, index) => {
            const daySessions = sessions.filter((s) => {
              const sessionDate = new Date(s.date)
              return (
                sessionDate.getFullYear() === date.getFullYear() &&
                sessionDate.getMonth() === date.getMonth() &&
                sessionDate.getDate() === date.getDate()
              )
            })

            const isToday =
              new Date().toDateString() === date.toDateString()

            return (
              <div
                key={index}
                className={`rounded-lg border p-2 min-h-[120px] ${
                  isToday ? "border-primary bg-primary/5" : ""
                }`}
              >
                <div className="mb-2 text-center">
                  <p className="text-xs text-muted-foreground">
                    {getDayNameShort(index)}
                  </p>
                  <p className={`text-sm font-medium ${isToday ? "text-primary" : ""}`}>
                    {date.getDate()}
                  </p>
                </div>
                <div className="space-y-1">
                  {daySessions.map((s) => (
                    <ClassCard
                      key={s.id}
                      session={s}
                      showBookButton={showBookButton}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
