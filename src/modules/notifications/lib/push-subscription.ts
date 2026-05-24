"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function savePushSubscription(subscription: {
  endpoint: string
  keys: { p256dh: string; auth: string }
}) {
  const session = await auth()
  if (!session?.user?.id) return

  await prisma.pushSubscription.upsert({
    where: {
      userId_endpoint: {
        userId: session.user.id,
        endpoint: subscription.endpoint,
      },
    },
    update: {
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
    create: {
      userId: session.user.id,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
  })
}

export async function removePushSubscription(endpoint: string) {
  const session = await auth()
  if (!session?.user?.id) return

  await prisma.pushSubscription.deleteMany({
    where: { userId: session.user.id, endpoint },
  })
}
