"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import type { ActionResult } from "@/types"
import type { Notification } from "@prisma/client"

export async function getNotifications(limit = 20): Promise<Notification[]> {
  const session = await auth()
  if (!session?.user?.id) return []

  return prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: limit,
  })
}

export async function getUnreadCount(): Promise<number> {
  const session = await auth()
  if (!session?.user?.id) return 0

  return prisma.notification.count({
    where: { userId: session.user.id, readAt: null },
  })
}

export async function markAsRead(id: string): Promise<ActionResult<null>> {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: "No autorizado" }

  await prisma.notification.update({
    where: { id, userId: session.user.id },
    data: { readAt: new Date() },
  })

  return { success: true, data: null }
}

export async function markAllAsRead(): Promise<ActionResult<null>> {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: "No autorizado" }

  await prisma.notification.updateMany({
    where: { userId: session.user.id, readAt: null },
    data: { readAt: new Date() },
  })

  return { success: true, data: null }
}

export async function createNotification(data: {
  userId: string
  type: string
  title: string
  body: string
  url?: string
}) {
  return prisma.notification.create({ data })
}
