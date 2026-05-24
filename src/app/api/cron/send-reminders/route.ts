import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { resend, FROM_EMAIL } from "@/lib/resend"

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const startOfDay = new Date(tomorrow.toISOString().split("T")[0])
  const endOfDay = new Date(startOfDay.getTime() + 86400000)

  const bookings = await prisma.booking.findMany({
    where: {
      status: "CONFIRMED",
      session: { date: { gte: startOfDay, lt: endOfDay } },
    },
    include: {
      user: { select: { email: true, name: true } },
      session: { include: { schedule: { include: { class: true } } } },
    },
  })

  let sent = 0
  for (const booking of bookings) {
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: booking.user.email,
        subject: `Recordatorio: ${booking.session.schedule.class.name} manana`,
        text: `Hola ${booking.user.name}, recuerda que manana tienes clase de ${booking.session.schedule.class.name} a las ${booking.session.schedule.startTime}.`,
      })
      sent++
    } catch {
      // continue with next booking
    }
  }

  return NextResponse.json({ sent, total: bookings.length })
}
