import type { Metadata } from "next"
import { WeekCalendar } from "@/modules/schedules/components/week-calendar"
import { MyBookings } from "@/modules/bookings/components/my-bookings"

export const metadata: Metadata = {
  title: "Reservas",
}

export default function ReservasPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Reservas</h1>
        <p className="text-muted-foreground">
          Reserva tu próxima clase o consulta tus reservas activas
        </p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Mis reservas</h2>
        <MyBookings />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Calendario de clases</h2>
        <WeekCalendar showBookButton={true} />
      </div>
    </div>
  )
}
