"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { classSchema } from "@/lib/validators"
import type { ActionResult } from "@/types"
import type { Class } from "@prisma/client"

export async function getClasses(): Promise<Class[]> {
  const session = await auth()
  if (!session?.user?.organizationId) return []

  return prisma.class.findMany({
    where: { organizationId: session.user.organizationId, isActive: true },
    orderBy: { name: "asc" },
  })
}

export async function createClass(input: unknown): Promise<ActionResult<Class>> {
  const session = await auth()
  if (!session?.user?.organizationId) {
    return { success: false, error: "No autorizado" }
  }
  if (session.user.role !== "ORG_ADMIN" && session.user.role !== "SUPER_ADMIN") {
    return { success: false, error: "Sin permisos" }
  }

  const parsed = classSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const created = await prisma.class.create({
    data: {
      ...parsed.data,
      organizationId: session.user.organizationId,
    },
  })

  return { success: true, data: created }
}

export async function updateClass(
  id: string,
  input: unknown
): Promise<ActionResult<Class>> {
  const session = await auth()
  if (!session?.user?.organizationId) {
    return { success: false, error: "No autorizado" }
  }
  if (session.user.role !== "ORG_ADMIN" && session.user.role !== "SUPER_ADMIN") {
    return { success: false, error: "Sin permisos" }
  }

  const parsed = classSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const existing = await prisma.class.findFirst({
    where: { id, organizationId: session.user.organizationId },
  })
  if (!existing) {
    return { success: false, error: "Clase no encontrada" }
  }

  const updated = await prisma.class.update({
    where: { id },
    data: parsed.data,
  })

  return { success: true, data: updated }
}

export async function deleteClass(id: string): Promise<ActionResult<null>> {
  const session = await auth()
  if (!session?.user?.organizationId) {
    return { success: false, error: "No autorizado" }
  }
  if (session.user.role !== "ORG_ADMIN" && session.user.role !== "SUPER_ADMIN") {
    return { success: false, error: "Sin permisos" }
  }

  const existing = await prisma.class.findFirst({
    where: { id, organizationId: session.user.organizationId },
  })
  if (!existing) {
    return { success: false, error: "Clase no encontrada" }
  }

  await prisma.class.update({
    where: { id },
    data: { isActive: false },
  })

  return { success: true, data: null }
}
