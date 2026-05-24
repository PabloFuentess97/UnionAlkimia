"use client"

import { useState } from "react"
import { createBooking, cancelBooking } from "../actions/booking-actions"

interface BookButtonProps {
  sessionId: string
  bookingId?: string
  status?: "CONFIRMED" | "WAITLISTED" | null
  isFull: boolean
}

export function BookButton({ sessionId, bookingId, status, isFull }: BookButtonProps) {
  const [loading, setLoading] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(status)
  const [error, setError] = useState<string | null>(null)

  async function handleBook() {
    setLoading(true)
    setError(null)
    const result = await createBooking(sessionId)
    if (result.success) {
      setCurrentStatus(result.data.status as "CONFIRMED" | "WAITLISTED")
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  async function handleCancel() {
    if (!bookingId) return
    setLoading(true)
    setError(null)
    const result = await cancelBooking(bookingId)
    if (result.success) {
      setCurrentStatus(null)
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  if (currentStatus === "CONFIRMED") {
    return (
      <div className="space-y-1">
        <button
          onClick={handleCancel}
          disabled={loading}
          className="w-full rounded-md bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20 disabled:opacity-50"
        >
          {loading ? "..." : "Cancelar"}
        </button>
      </div>
    )
  }

  if (currentStatus === "WAITLISTED") {
    return (
      <div className="space-y-1">
        <span className="block text-center text-xs text-amber-600 font-medium">
          En lista de espera
        </span>
        <button
          onClick={handleCancel}
          disabled={loading}
          className="w-full rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/80 disabled:opacity-50"
        >
          Salir de la lista
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <button
        onClick={handleBook}
        disabled={loading}
        className="w-full rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? "..." : isFull ? "Lista de espera" : "Reservar"}
      </button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
