"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import type { ClassSessionWithDetails } from "../types"
import { getWeekDates, shouldGenerateSession } from "../lib/schedule-utils"

export async function getWeekSessions(
  weekOffset = 0
): Promise<ClassSessionWithDetails[]> {
  const session = await auth()
  if (!session?.user?.organizationId) return []

  const baseDate = new Date()
  baseDate.setDate(baseDate.getDate() + weekOffset * 7)
  const weekDates = getWeekDates(baseDate)

  const startOfWeek = weekDates[0]
  const endOfWeek = new Date(weekDates[6])
  endOfWeek.setHours(23, 59, 59, 999)

  const existingSessions = await prisma.classSession.findMany({
    where: {
      organizationId: session.user.organizationId,
      date: { gte: startOfWeek, lte: endOfWeek },
    },
    include: {
      schedule: {
        include: {
          class: true,
          teacher: { select: { id: true, name: true, avatar: true } },
          room: true,
        },
      },
    },
    orderBy: { date: "asc" },
  })

  if (existingSessions.length > 0) {
    return existingSessions as ClassSessionWithDetails[]
  }

  const schedules = await prisma.schedule.findMany({
    where: { organizationId: session.user.organizationId, isActive: true },
    include: {
      class: true,
      teacher: { select: { id: true, name: true, avatar: true } },
      room: true,
    },
  })

  const sessionsToCreate: Array<{
    organizationId: string
    scheduleId: string
    date: Date
  }> = []

  for (const schedule of schedules) {
    for (const date of weekDates) {
      if (date.getDay() === 0 ? 6 : date.getDay() - 1) {
        const adjustedDayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1
        if (adjustedDayOfWeek !== schedule.dayOfWeek) continue
      }

      const adjustedDayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1
      if (adjustedDayOfWeek !== schedule.dayOfWeek) continue

      if (
        shouldGenerateSession(
          schedule.startDate,
          schedule.endDate,
          date,
          schedule.recurrence
        )
      ) {
        sessionsToCreate.push({
          organizationId: session.user.organizationId,
          scheduleId: schedule.id,
          date,
        })
      }
    }
  }

  if (sessionsToCreate.length > 0) {
    await prisma.classSession.createMany({
      data: sessionsToCreate,
      skipDuplicates: true,
    })

    const created = await prisma.classSession.findMany({
      where: {
        organizationId: session.user.organizationId,
        date: { gte: startOfWeek, lte: endOfWeek },
      },
      include: {
        schedule: {
          include: {
            class: true,
            teacher: { select: { id: true, name: true, avatar: true } },
            room: true,
          },
        },
      },
      orderBy: { date: "asc" },
    })

    return created as ClassSessionWithDetails[]
  }

  return []
}

export async function cancelSession(
  sessionId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user?.organizationId) {
    return { success: false, error: "No autorizado" }
  }

  const classSession = await prisma.classSession.findFirst({
    where: { id: sessionId, organizationId: session.user.organizationId },
  })
  if (!classSession) {
    return { success: false, error: "Sesión no encontrada" }
  }

  await prisma.classSession.update({
    where: { id: sessionId },
    data: { status: "CANCELLED", notes: reason },
  })

  await prisma.booking.updateMany({
    where: { sessionId, status: "CONFIRMED" },
    data: { status: "CANCELLED", cancelledAt: new Date() },
  })

  return { success: true }
}
