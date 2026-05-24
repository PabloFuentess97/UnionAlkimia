import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin - Reservas",
}

export default async function AdminReservasPage() {
  const session = await auth()
  if (!session?.user?.organizationId) return null

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)

  const bookings = await prisma.booking.findMany({
    where: {
      organizationId: session.user.organizationId,
      session: { date: { gte: todayStart, lte: todayEnd } },
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
      session: {
        include: {
          schedule: {
            include: {
              class: true,
              teacher: { select: { id: true, name: true } },
            },
          },
        },
      },
    },
    orderBy: { session: { date: "asc" } },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reservas de hoy</h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-xl border p-8 text-center text-muted-foreground">
          No hay reservas para hoy.
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Alumno</th>
                <th className="px-4 py-3 text-left font-medium">Clase</th>
                <th className="px-4 py-3 text-left font-medium">Hora</th>
                <th className="px-4 py-3 text-left font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium">{booking.user.name}</p>
                    <p className="text-xs text-muted-foreground">{booking.user.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    {booking.session.schedule.class.name}
                  </td>
                  <td className="px-4 py-3">
                    {booking.session.schedule.startTime}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        booking.status === "CONFIRMED"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "CHECKED_IN"
                          ? "bg-blue-100 text-blue-700"
                          : booking.status === "WAITLISTED"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {booking.status === "CONFIRMED" && "Confirmada"}
                      {booking.status === "CHECKED_IN" && "Check-in"}
                      {booking.status === "WAITLISTED" && "Espera"}
                      {booking.status === "CANCELLED" && "Cancelada"}
                      {booking.status === "NO_SHOW" && "No show"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
