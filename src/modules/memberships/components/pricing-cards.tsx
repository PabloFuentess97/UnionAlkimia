"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { createStripeCheckout } from "../actions/checkout-actions"
import type { MembershipPlan } from "@prisma/client"

interface PricingCardsProps {
  plans: MembershipPlan[]
  currentPlanId?: string
}

export function PricingCards({ plans, currentPlanId }: PricingCardsProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  async function handleCheckout(planId: string) {
    setLoadingId(planId)
    const result = await createStripeCheckout(planId)
    if (result.success) {
      window.location.href = result.data.url
    }
    setLoadingId(null)
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => {
        const isCurrent = plan.id === currentPlanId
        const features = (plan.features as string[]) || []

        return (
          <div
            key={plan.id}
            className={`rounded-xl border p-6 ${
              isCurrent ? "border-primary ring-2 ring-primary/20" : ""
            }`}
          >
            {isCurrent && (
              <span className="mb-2 inline-block text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                Tu plan actual
              </span>
            )}
            <h3 className="text-lg font-semibold">{plan.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {plan.description}
            </p>
            <div className="mt-4">
              <span className="text-3xl font-bold">
                {formatCurrency(plan.price)}
              </span>
              <span className="text-sm text-muted-foreground">
                /{plan.interval === "MONTHLY" ? "mes" : plan.interval === "QUARTERLY" ? "trimestre" : "año"}
              </span>
            </div>

            {plan.classesPerMonth && (
              <p className="mt-2 text-sm text-muted-foreground">
                {plan.classesPerMonth} clases/mes
              </p>
            )}

            <ul className="mt-4 space-y-2">
              {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleCheckout(plan.id)}
              disabled={isCurrent || loadingId === plan.id}
              className="mt-6 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isCurrent
                ? "Plan actual"
                : loadingId === plan.id
                ? "Procesando..."
                : "Suscribirse"}
            </button>
          </div>
        )
      })}
    </div>
  )
}
