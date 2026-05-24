import Link from "next/link"
import type { Booking, ClassSession, Schedule, Class, Room } from "@prisma/client"

type BookingWithSession = Booking & {
  session: ClassSession & {
    schedule: Schedule & { class: Class; room: Room | null }
  }
}

export function UpcomingClassesWidget({
  bookings,
}: {
  bookings: BookingWithSession[]
}) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-xl border p-6">
        <h2 className="font-semibold mb-4">Proximas clases</h2>
        <p className="text-sm text-muted-foreground">
          No tienes reservas pendientes.
        </p>
        <Link
          href="/reservas"
          className="mt-4 inline-block text-sm text-primary hover:underline"
        >
          Reservar una clase
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-xl border p-6">
      <h2 className="font-semibold mb-4">Proximas clases</h2>
      <ul className="space-y-3">
        {bookings.map((booking) => {
          const date = new Date(booking.session.date)
          return (
            <li key={booking.id} className="flex items-center gap-3">
              <div
                className="h-10 w-1 rounded-full"
                style={{
                  backgroundColor:
                    booking.session.schedule.class.color || "#22c55e",
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {booking.session.schedule.class.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {date.toLocaleDateString("es", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}{" "}
                  a las {booking.session.schedule.startTime}
                  {booking.session.schedule.room &&
                    ` - ${booking.session.schedule.room.name}`}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
