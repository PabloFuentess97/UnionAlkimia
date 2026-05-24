"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { scheduleSchema } from "@/lib/validators"
import type { ActionResult } from "@/types"
import type { Schedule } from "@prisma/client"
import type { ScheduleWithRelations } from "../types"

export async function getSchedules(): Promise<ScheduleWithRelations[]> {
  const session = await auth()
  if (!session?.user?.organizationId) return []

  return prisma.schedule.findMany({
    where: { organizationId: session.user.organizationId, isActive: true },
    include: {
      class: true,
      teacher: { select: { id: true, name: true, avatar: true } },
      room: true,
      sessions: {
        where: { status: "SCHEDULED" },
        orderBy: { date: "asc" },
        take: 10,
      },
    },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  })
}

export async function createSchedule(input: unknown): Promise<ActionResult<Schedule>> {
  const session = await auth()
  if (!session?.user?.organizationId) {
    return { success: false, error: "No autorizado" }
  }
  if (session.user.role !== "ORG_ADMIN" && session.user.role !== "SUPER_ADMIN") {
    return { success: false, error: "Sin permisos" }
  }

  const parsed = scheduleSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const created = await prisma.schedule.create({
    data: {
      ...parsed.data,
      startDate: new Date(parsed.data.startDate),
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
      organizationId: session.user.organizationId,
    },
  })

  return { success: true, data: created }
}

export async function updateSchedule(
  id: string,
  input: unknown
): Promise<ActionResult<Schedule>> {
  const session = await auth()
  if (!session?.user?.organizationId) {
    return { success: false, error: "No autorizado" }
  }
  if (session.user.role !== "ORG_ADMIN" && session.user.role !== "SUPER_ADMIN") {
    return { success: false, error: "Sin permisos" }
  }

  const parsed = scheduleSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const existing = await prisma.schedule.findFirst({
    where: { id, organizationId: session.user.organizationId },
  })
  if (!existing) {
    return { success: false, error: "Horario no encontrado" }
  }

  const updated = await prisma.schedule.update({
    where: { id },
    data: {
      ...parsed.data,
      startDate: new Date(parsed.data.startDate),
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
    },
  })

  return { success: true, data: updated }
}

export async function deleteSchedule(id: string): Promise<ActionResult<null>> {
  const session = await auth()
  if (!session?.user?.organizationId) {
    return { success: false, error: "No autorizado" }
  }
  if (session.user.role !== "ORG_ADMIN" && session.user.role !== "SUPER_ADMIN") {
    return { success: false, error: "Sin permisos" }
  }

  const existing = await prisma.schedule.findFirst({
    where: { id, organizationId: session.user.organizationId },
  })
  if (!existing) {
    return { success: false, error: "Horario no encontrado" }
  }

  await prisma.schedule.update({
    where: { id },
    data: { isActive: false },
  })

  return { success: true, data: null }
}
