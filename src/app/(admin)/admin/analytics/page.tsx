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
  title: "Admin - Analytics",
}

export default async function AdminAnalyticsPage() {
  const [metrics, revenueData, popularClasses] = await Promise.all([
    getDashboardMetrics(),
    getRevenueByMonth(12),
    getPopularClasses(10),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Metricas y rendimiento del negocio
        </p>
      </div>

      {metrics && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Miembros activos"
            value={metrics.activeMembers}
          />
          <StatCard
            label="MRR"
            value={`$${metrics.mrr.toLocaleString()}`}
            change={metrics.mrrChange}
          />
          <StatCard
            label="Reservas del mes"
            value={metrics.bookingsMonth}
            change={metrics.bookingsChange}
          />
          <StatCard
            label="Reservas hoy"
            value={metrics.bookingsToday}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueChart data={revenueData} />
        <PopularClasses data={popularClasses} />
      </div>
    </div>
  )
}
