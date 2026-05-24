import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    )
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object
      const userId = session.metadata?.userId
      const organizationId = session.metadata?.organizationId

      if (userId && organizationId && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        )

        const priceId = subscription.items.data[0]?.price?.id
        const plan = await prisma.membershipPlan.findFirst({
          where: { stripePriceId: priceId, organizationId },
        })

        if (plan) {
          const sub = subscription as unknown as { current_period_start: number; current_period_end: number; id: string }
          await prisma.membership.create({
            data: {
              organizationId,
              userId,
              planId: plan.id,
              status: "ACTIVE",
              stripeSubscriptionId: sub.id,
              currentPeriodStart: new Date(sub.current_period_start * 1000),
              currentPeriodEnd: new Date(sub.current_period_end * 1000),
            },
          })

          await prisma.payment.create({
            data: {
              organizationId,
              userId,
              amount: plan.price,
              currency: plan.currency,
              provider: "STRIPE",
              providerPaymentId: session.payment_intent as string,
              status: "COMPLETED",
              description: `Suscripción: ${plan.name}`,
            },
          })
        }
      }
      break
    }

    case "invoice.paid": {
      const invoice = event.data.object
      const subscriptionId = (invoice as unknown as { subscription: string }).subscription

      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const sub = subscription as unknown as { current_period_start: number; current_period_end: number }

        await prisma.membership.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: {
            status: "ACTIVE",
            currentPeriodStart: new Date(sub.current_period_start * 1000),
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
            classesUsedThisMonth: 0,
          },
        })
      }
      break
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object
      const subId = (subscription as unknown as { id: string }).id

      await prisma.membership.updateMany({
        where: { stripeSubscriptionId: subId },
        data: { status: "CANCELLED", cancelledAt: new Date() },
      })
      break
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object
      const subscriptionId = (invoice as unknown as { subscription: string }).subscription

      if (subscriptionId) {
        await prisma.membership.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: { status: "PAST_DUE" },
        })
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
