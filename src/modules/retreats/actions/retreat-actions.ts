"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"
import type { ActionResult } from "@/types"
import type { Retreat, RetreatBooking } from "@prisma/client"

const retreatSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  location: z.string().min(2),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  price: z.number().min(0),
  currency: z.string().default("EUR"),
  maxParticipants: z.number().min(1),
})

export async function getRetreats(): Promise<Retreat[]> {
  const session = await auth()
  if (!session?.user?.organizationId) return []

  return prisma.retreat.findMany({
    where: { organizationId: session.user.organizationId },
    orderBy: { startDate: "asc" },
  })
}

export async function getPublicRetreats(): Promise<Retreat[]> {
  const session = await auth()
  if (!session?.user?.organizationId) return []

  return prisma.retreat.findMany({
    where: {
      organizationId: session.user.organizationId,
      isPublished: true,
      endDate: { gte: new Date() },
    },
    orderBy: { startDate: "asc" },
  })
}

export async function createRetreat(input: unknown): Promise<ActionResult<Retreat>> {
  const session = await auth()
  if (!session?.user?.organizationId) {
    return { success: false, error: "No autorizado" }
  }

  const parsed = retreatSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const retreat = await prisma.retreat.create({
    data: {
      ...parsed.data,
      startDate: new Date(parsed.data.startDate),
      endDate: new Date(parsed.data.endDate),
      organizationId: session.user.organizationId,
    },
  })

  return { success: true, data: retreat }
}

export async function bookRetreat(retreatId: string): Promise<ActionResult<RetreatBooking>> {
  const session = await auth()
  if (!session?.user?.id || !session?.user?.organizationId) {
    return { success: false, error: "No autorizado" }
  }

  const retreat = await prisma.retreat.findFirst({
    where: { id: retreatId, isPublished: true },
    include: { _count: { select: { bookings: true } } },
  })

  if (!retreat) {
    return { success: false, error: "Retiro no encontrado" }
  }

  if (retreat._count.bookings >= retreat.maxParticipants) {
    return { success: false, error: "El retiro está completo" }
  }

  const booking = await prisma.retreatBooking.create({
    data: {
      organizationId: session.user.organizationId,
      retreatId,
      userId: session.user.id,
      status: "PENDING",
    },
  })

  return { success: true, data: booking }
}
