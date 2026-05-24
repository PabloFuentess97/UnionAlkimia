import Link from "next/link"
import type { Membership, MembershipPlan } from "@prisma/client"

type MembershipWithPlan = Membership & { plan: MembershipPlan }

export function MembershipStatusWidget({
  membership,
}: {
  membership: MembershipWithPlan | null
}) {
  if (!membership) {
    return (
      <div className="rounded-xl border p-6">
        <h2 className="font-semibold mb-4">Mi membresia</h2>
        <p className="text-sm text-muted-foreground">
          No tienes una membresia activa.
        </p>
        <Link
          href="/membresias"
          className="mt-4 inline-block text-sm text-primary hover:underline"
        >
          Ver planes
        </Link>
      </div>
    )
  }

  const daysLeft = Math.ceil(
    (new Date(membership.currentPeriodEnd).getTime() - Date.now()) /
      (1000 * 60 * 60 * 24)
  )

  const classesUsed = membership.classesUsedThisMonth
  const classesTotal = membership.plan.classesPerMonth

  return (
    <div className="rounded-xl border p-6">
      <h2 className="font-semibold mb-4">Mi membresia</h2>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Plan</span>
          <span className="text-sm font-medium">{membership.plan.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Estado</span>
          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
            Activa
          </span>
        </div>
        {classesTotal && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Clases</span>
            <span className="text-sm font-medium">
              {classesUsed}/{classesTotal} usadas
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Renueva en</span>
          <span className="text-sm font-medium">{daysLeft} dias</span>
        </div>
      </div>
    </div>
  )
}
