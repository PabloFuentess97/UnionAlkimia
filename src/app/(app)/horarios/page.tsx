import type { Metadata } from "next"
import { WeekCalendar } from "@/modules/schedules/components/week-calendar"

export const metadata: Metadata = {
  title: "Horarios",
}

export default function HorariosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Horarios</h1>
        <p className="text-muted-foreground">
          Consulta el horario semanal de clases
        </p>
      </div>
      <WeekCalendar showBookButton={true} />
    </div>
  )
}
