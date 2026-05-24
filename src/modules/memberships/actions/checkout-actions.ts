"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { createCheckoutSession } from "@/lib/stripe"
import type { ActionResult } from "@/types"

export async function createStripeCheckout(
  planId: string
): Promise<ActionResult<{ url: string }>> {
  const session = await auth()
  if (!session?.user?.id || !session?.user?.organizationId) {
    return { success: false, error: "No autorizado" }
  }

  const plan = await prisma.membershipPlan.findFirst({
    where: { id: planId, organizationId: session.user.organizationId },
  })

  if (!plan) {
    return { success: false, error: "Plan no encontrado" }
  }

  if (!plan.stripePriceId) {
    return { success: false, error: "Plan no configurado para Stripe" }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  const checkoutSession = await createCheckoutSession({
    priceId: plan.stripePriceId,
    userId: session.user.id,
    organizationId: session.user.organizationId,
    customerEmail: session.user.email,
    successUrl: `${appUrl}/membresias?success=true`,
    cancelUrl: `${appUrl}/membresias?cancelled=true`,
  })

  if (!checkoutSession.url) {
    return { success: false, error: "Error al crear sesión de pago" }
  }

  return { success: true, data: { url: checkoutSession.url } }
}

export async function cancelMembership(
  membershipId: string
): Promise<ActionResult<null>> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "No autorizado" }
  }

  const membership = await prisma.membership.findFirst({
    where: { id: membershipId, userId: session.user.id },
  })

  if (!membership) {
    return { success: false, error: "Membresía no encontrada" }
  }

  await prisma.membership.update({
    where: { id: membershipId },
    data: { status: "CANCELLED", cancelledAt: new Date() },
  })

  return { success: true, data: null }
}

export async function getMyMembership() {
  const session = await auth()
  if (!session?.user?.id || !session?.user?.organizationId) return null

  return prisma.membership.findFirst({
    where: {
      userId: session.user.id,
      organizationId: session.user.organizationId,
      status: { in: ["ACTIVE", "TRIALING"] },
    },
    include: { plan: true },
  })
}
