"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"
import type { ActionResult } from "@/types"
import type { Room } from "@prisma/client"

const roomSchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  capacity: z.number().min(1, "Capacidad mínima 1"),
})

export async function getRooms(): Promise<Room[]> {
  const session = await auth()
  if (!session?.user?.organizationId) return []

  return prisma.room.findMany({
    where: { organizationId: session.user.organizationId, isActive: true },
    orderBy: { name: "asc" },
  })
}

export async function createRoom(input: unknown): Promise<ActionResult<Room>> {
  const session = await auth()
  if (!session?.user?.organizationId) {
    return { success: false, error: "No autorizado" }
  }
  if (session.user.role !== "ORG_ADMIN" && session.user.role !== "SUPER_ADMIN") {
    return { success: false, error: "Sin permisos" }
  }

  const parsed = roomSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const created = await prisma.room.create({
    data: {
      ...parsed.data,
      organizationId: session.user.organizationId,
    },
  })

  return { success: true, data: created }
}

export async function deleteRoom(id: string): Promise<ActionResult<null>> {
  const session = await auth()
  if (!session?.user?.organizationId) {
    return { success: false, error: "No autorizado" }
  }

  await prisma.room.update({
    where: { id },
    data: { isActive: false },
  })

  return { success: true, data: null }
}
