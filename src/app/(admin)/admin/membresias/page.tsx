import { getPlans } from "@/modules/memberships/actions/plan-actions"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { formatCurrency } from "@/lib/utils"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin - Membresías",
}

export default async function AdminMembresiasPage() {
  const session = await auth()
  if (!session?.user?.organizationId) return null

  const [plans, activeMemberships] = await Promise.all([
    getPlans(),
    prisma.membership.count({
      where: { organizationId: session.user.organizationId, status: "ACTIVE" },
    }),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Membresías</h1>
          <p className="text-muted-foreground">
            {activeMemberships} suscripciones activas
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Planes</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.id} className="rounded-xl border p-5">
              <h3 className="font-semibold">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              <p className="mt-3 text-2xl font-bold">
                {formatCurrency(plan.price)}
                <span className="text-sm font-normal text-muted-foreground">
                  /{plan.interval === "MONTHLY" ? "mes" : "año"}
                </span>
              </p>
              {plan.classesPerMonth && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.classesPerMonth} clases/mes
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
