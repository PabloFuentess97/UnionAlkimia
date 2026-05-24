import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import type { Metadata } from "next"
import { StatCard } from "@/modules/analytics/components/stat-card"
import { RevenueChart } from "@/modules/analytics/components/revenue-chart"
import { PopularClasses } from "@/modules/analytics/components/popular-classes"
import {
  getDashboardMetrics,
  getRevenueByMonth,
  getPopularClasses,
} from "@/modules/analytics/lib/metrics"

export const metadata: Metadata = {
  title: "Admin Dashboard",
}

export default async function AdminDashboardPage() {
  const session = await auth()
  if (!session?.user?.organizationId) return null
  const orgId = session.user.organizationId

  const [metrics, revenueData, popularClasses, recentPayments] =
    await Promise.all([
      getDashboardMetrics(),
      getRevenueByMonth(),
      getPopularClasses(),
      prisma.payment.findMany({
        where: { organizationId: orgId, status: "COMPLETED" },
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Panel de administracion</h1>
        <p className="text-muted-foreground">
          {session.user.organizationName}
        </p>
      </div>

      {metrics && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Miembros activos"
            value={metrics.activeMembers}
          />
          <StatCard
            label="Ingresos del mes"
            value={`$${metrics.mrr.toLocaleString()}`}
            change={metrics.mrrChange}
          />
          <StatCard
            label="Reservas hoy"
            value={metrics.bookingsToday}
          />
          <StatCard
            label="Reservas del mes"
            value={metrics.bookingsMonth}
            change={metrics.bookingsChange}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueChart data={revenueData} />
        <PopularClasses data={popularClasses} />
      </div>

      <div className="rounded-xl border p-6">
        <h3 className="font-semibold mb-4">Ultimos pagos</h3>
        {recentPayments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay pagos recientes.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 font-medium">Usuario</th>
                  <th className="pb-2 font-medium">Monto</th>
                  <th className="pb-2 font-medium">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="py-2">{p.user.name}</td>
                    <td className="py-2">
                      ${p.amount.toLocaleString()} {p.currency}
                    </td>
                    <td className="py-2 text-muted-foreground">
                      {new Date(p.createdAt).toLocaleDateString("es", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
