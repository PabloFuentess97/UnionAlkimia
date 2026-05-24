import webpush from "web-push"
import { prisma } from "@/lib/db"
import type { PushSubscription } from "@prisma/client"

webpush.setVapidDetails(
  `mailto:${process.env.VAPID_EMAIL || "admin@unionalkimia.com"}`,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
  process.env.VAPID_PRIVATE_KEY || ""
)

export async function sendPushToUser(
  userId: string,
  payload: { title: string; body: string; url?: string }
) {
  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId },
  })

  const results = await Promise.allSettled(
    subscriptions.map((sub: PushSubscription) =>
      webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        JSON.stringify(payload)
      )
    )
  )

  const failed = results
    .map((r: PromiseSettledResult<unknown>, i: number) =>
      r.status === "rejected" ? subscriptions[i] : null
    )
    .filter((s): s is PushSubscription => s !== null)

  if (failed.length > 0) {
    await prisma.pushSubscription.deleteMany({
      where: { id: { in: failed.map((s) => s.id) } },
    })
  }
}

export async function sendPushToOrg(
  organizationId: string,
  payload: { title: string; body: string; url?: string }
) {
  const members = await prisma.organizationMember.findMany({
    where: { organizationId },
    select: { userId: true },
  })

  await Promise.allSettled(
    members.map((m) => sendPushToUser(m.userId, payload))
  )
}
