"use client"

import { useState, useEffect } from "react"
import { getMyBookings } from "../actions/booking-actions"
import { cancelBooking } from "../actions/booking-actions"
import type { BookingWithSession } from "../types"

export function MyBookings() {
  const [bookings, setBookings] = useState<BookingWithSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyBookings().then((data) => {
      setBookings(data)
      setLoading(false)
    })
  }, [])

  async function handleCancel(bookingId: string) {
    const result = await cancelBooking(bookingId)
    if (result.success) {
      setBookings((prev) => prev.filter((b) => b.id !== bookingId))
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="rounded-xl border p-6 text-center text-muted-foreground">
        <p>No tienes reservas pendientes.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking) => {
        const { session } = booking
        const { schedule } = session
        const date = new Date(session.date)

        return (
          <div
            key={booking.id}
            className="flex items-center justify-between rounded-lg border p-4"
            style={{ borderLeftColor: schedule.class.color || "#22c55e", borderLeftWidth: "4px" }}
          >
            <div>
              <p className="font-medium">{schedule.class.name}</p>
              <p className="text-sm text-muted-foreground">
                {date.toLocaleDateString("es-ES", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
                {" · "}
                {schedule.startTime} - {schedule.endTime}
              </p>
              <p className="text-xs text-muted-foreground">
                {schedule.teacher.name}
                {schedule.room ? ` · ${schedule.room.name}` : ""}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              {booking.status === "WAITLISTED" && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                  Espera #{booking.waitlistPosition}
                </span>
              )}
              {booking.status === "CONFIRMED" && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  Confirmada
                </span>
              )}
              <button
                onClick={() => handleCancel(booking.id)}
                className="text-xs text-destructive hover:underline"
              >
                Cancelar
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
