import { prisma } from "@/lib/db"

export async function canUserBook(
  userId: string,
  organizationId: string,
  sessionId: string
): Promise<{ allowed: boolean; reason?: string }> {
  const membership = await prisma.membership.findFirst({
    where: {
      userId,
      organizationId,
      status: "ACTIVE",
      currentPeriodEnd: { gte: new Date() },
    },
    include: { plan: true },
  })

  if (!membership) {
    return { allowed: false, reason: "Necesitas una membresía activa para reservar" }
  }

  if (membership.plan.classesPerMonth !== null) {
    if (membership.classesUsedThisMonth >= membership.plan.classesPerMonth) {
      return { allowed: false, reason: "Has alcanzado el límite de clases de tu plan" }
    }
  }

  const existingBooking = await prisma.booking.findUnique({
    where: { userId_sessionId: { userId, sessionId } },
  })

  if (existingBooking && existingBooking.status !== "CANCELLED") {
    return { allowed: false, reason: "Ya tienes una reserva para esta clase" }
  }

  const session = await prisma.classSession.findUnique({
    where: { id: sessionId },
    include: { schedule: { include: { class: true } } },
  })

  if (!session) {
    return { allowed: false, reason: "Sesión no encontrada" }
  }

  if (session.status === "CANCELLED") {
    return { allowed: false, reason: "Esta clase ha sido cancelada" }
  }

  if (session.currentCapacity >= session.schedule.class.maxCapacity) {
    return { allowed: false, reason: "FULL" }
  }

  return { allowed: true }
}

export function canCancelBooking(bookingDate: Date, hoursBeforePolicy = 2): boolean {
  const now = new Date()
  const diffMs = bookingDate.getTime() - now.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)
  return diffHours >= hoursBeforePolicy
}
