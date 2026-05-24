"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import type { ActionResult } from "@/types"
import type { Booking } from "@prisma/client"
import type { BookingWithSession } from "../types"
import { canUserBook, canCancelBooking } from "../lib/booking-rules"

export async function createBooking(
  sessionId: string
): Promise<ActionResult<Booking>> {
  const session = await auth()
  if (!session?.user?.id || !session?.user?.organizationId) {
    return { success: false, error: "No autorizado" }
  }

  const { allowed, reason } = await canUserBook(
    session.user.id,
    session.user.organizationId,
    sessionId
  )

  if (!allowed) {
    if (reason === "FULL") {
      return await joinWaitlist(sessionId)
    }
    return { success: false, error: reason ?? "No se puede reservar" }
  }

  const booking = await prisma.booking.create({
    data: {
      organizationId: session.user.organizationId,
      userId: session.user.id,
      sessionId,
      status: "CONFIRMED",
    },
  })

  await prisma.classSession.update({
    where: { id: sessionId },
    data: { currentCapacity: { increment: 1 } },
  })

  await prisma.membership.updateMany({
    where: {
      userId: session.user.id,
      organizationId: session.user.organizationId,
      status: "ACTIVE",
    },
    data: { classesUsedThisMonth: { increment: 1 } },
  })

  return { success: true, data: booking }
}

export async function cancelBooking(
  bookingId: string
): Promise<ActionResult<null>> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "No autorizado" }
  }

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, userId: session.user.id },
    include: { session: true },
  })

  if (!booking) {
    return { success: false, error: "Reserva no encontrada" }
  }

  if (booking.status === "CANCELLED") {
    return { success: false, error: "La reserva ya está cancelada" }
  }

  if (!canCancelBooking(booking.session.date)) {
    return {
      success: false,
      error: "No se puede cancelar con menos de 2 horas de antelación",
    }
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED", cancelledAt: new Date() },
  })

  if (booking.status === "CONFIRMED") {
    await prisma.classSession.update({
      where: { id: booking.sessionId },
      data: { currentCapacity: { decrement: 1 } },
    })

    const nextWaitlisted = await prisma.booking.findFirst({
      where: { sessionId: booking.sessionId, status: "WAITLISTED" },
      orderBy: { waitlistPosition: "asc" },
    })

    if (nextWaitlisted) {
      await prisma.booking.update({
        where: { id: nextWaitlisted.id },
        data: { status: "CONFIRMED", waitlistPosition: null },
      })
      await prisma.classSession.update({
        where: { id: booking.sessionId },
        data: { currentCapacity: { increment: 1 } },
      })
    }
  }

  return { success: true, data: null }
}

async function joinWaitlist(
  sessionId: string
): Promise<ActionResult<Booking>> {
  const session = await auth()
  if (!session?.user?.id || !session?.user?.organizationId) {
    return { success: false, error: "No autorizado" }
  }

  const lastWaitlisted = await prisma.booking.findFirst({
    where: { sessionId, status: "WAITLISTED" },
    orderBy: { waitlistPosition: "desc" },
  })

  const position = (lastWaitlisted?.waitlistPosition ?? 0) + 1

  const booking = await prisma.booking.create({
    data: {
      organizationId: session.user.organizationId,
      userId: session.user.id,
      sessionId,
      status: "WAITLISTED",
      waitlistPosition: position,
    },
  })

  return { success: true, data: booking }
}

export async function checkInBooking(
  bookingId: string
): Promise<ActionResult<null>> {
  const session = await auth()
  if (!session?.user?.organizationId) {
    return { success: false, error: "No autorizado" }
  }

  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      organizationId: session.user.organizationId,
      status: "CONFIRMED",
    },
  })

  if (!booking) {
    return { success: false, error: "Reserva no encontrada o no confirmada" }
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CHECKED_IN", checkedInAt: new Date() },
  })

  return { success: true, data: null }
}

export async function getMyBookings(): Promise<BookingWithSession[]> {
  const session = await auth()
  if (!session?.user?.id || !session?.user?.organizationId) return []

  return prisma.booking.findMany({
    where: {
      userId: session.user.id,
      organizationId: session.user.organizationId,
      status: { in: ["CONFIRMED", "WAITLISTED", "CHECKED_IN"] },
    },
    include: {
      session: {
        include: {
          schedule: {
            include: {
              class: true,
              teacher: { select: { id: true, name: true, avatar: true } },
              room: true,
            },
          },
        },
      },
    },
    orderBy: { session: { date: "asc" } },
  }) as Promise<BookingWithSession[]>
}

export async function getSessionBookings(
  sessionId: string
): Promise<Array<Booking & { user: { id: string; name: string; email: string } }>> {
  const session = await auth()
  if (!session?.user?.organizationId) return []

  return prisma.booking.findMany({
    where: {
      sessionId,
      organizationId: session.user.organizationId,
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "asc" },
  })
}
