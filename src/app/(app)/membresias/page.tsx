import { getPlans } from "@/modules/memberships/actions/plan-actions"
import { getMyMembership } from "@/modules/memberships/actions/checkout-actions"
import { PricingCards } from "@/modules/memberships/components/pricing-cards"
import { formatCurrency } from "@/lib/utils"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Membresías",
}

export default async function MembresiasPage() {
  const [plans, membership] = await Promise.all([getPlans(), getMyMembership()])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Membresías</h1>
        <p className="text-muted-foreground">
          Gestiona tu plan y suscripción
        </p>
      </div>

      {membership && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">{membership.plan.name}</h2>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(membership.plan.price)}/
                {membership.plan.interval === "MONTHLY" ? "mes" : "año"}
              </p>
            </div>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
              Activa
            </span>
          </div>
          {membership.plan.classesPerMonth && (
            <div className="mt-4">
              <div className="flex justify-between text-sm">
                <span>Clases usadas este mes</span>
                <span className="font-medium">
                  {membership.classesUsedThisMonth}/{membership.plan.classesPerMonth}
                </span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${Math.min(
                      (membership.classesUsedThisMonth / membership.plan.classesPerMonth) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}
          <p className="mt-4 text-xs text-muted-foreground">
            Renovación:{" "}
            {new Date(membership.currentPeriodEnd).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-4">
          {membership ? "Cambiar de plan" : "Elige tu plan"}
        </h2>
        <PricingCards plans={plans} currentPlanId={membership?.planId} />
      </div>
    </div>
  )
}
