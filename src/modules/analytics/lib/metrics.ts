"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function getDashboardMetrics() {
  const session = await auth()
  if (!session?.user?.organizationId) return null
  const orgId = session.user.organizationId

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  const [
    activeMembers,
    totalRevenue,
    lastMonthRevenue,
    bookingsToday,
    totalBookingsMonth,
    lastMonthBookings,
  ] = await Promise.all([
    prisma.membership.count({
      where: { organizationId: orgId, status: "ACTIVE" },
    }),
    prisma.payment.aggregate({
      where: {
        organizationId: orgId,
        status: "COMPLETED",
        createdAt: { gte: startOfMonth },
      },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: {
        organizationId: orgId,
        status: "COMPLETED",
        createdAt: { gte: startOfLastMonth, lt: startOfMonth },
      },
      _sum: { amount: true },
    }),
    prisma.booking.count({
      where: {
        organizationId: orgId,
        status: "CONFIRMED",
        session: {
          date: {
            gte: new Date(now.toISOString().split("T")[0]),
            lt: new Date(
              new Date(now.getTime() + 86400000).toISOString().split("T")[0]
            ),
          },
        },
      },
    }),
    prisma.booking.count({
      where: {
        organizationId: orgId,
        createdAt: { gte: startOfMonth },
        status: { in: ["CONFIRMED", "CHECKED_IN"] },
      },
    }),
    prisma.booking.count({
      where: {
        organizationId: orgId,
        createdAt: { gte: startOfLastMonth, lt: startOfMonth },
        status: { in: ["CONFIRMED", "CHECKED_IN"] },
      },
    }),
  ])

  const currentRevenue = totalRevenue._sum.amount ?? 0
  const prevRevenue = lastMonthRevenue._sum.amount ?? 0

  return {
    activeMembers,
    mrr: currentRevenue,
    mrrChange: prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : 0,
    bookingsToday,
    bookingsMonth: totalBookingsMonth,
    bookingsChange:
      lastMonthBookings > 0
        ? ((totalBookingsMonth - lastMonthBookings) / lastMonthBookings) * 100
        : 0,
  }
}

export async function getRevenueByMonth(months = 6) {
  const session = await auth()
  if (!session?.user?.organizationId) return []
  const orgId = session.user.organizationId

  const results: { month: string; revenue: number }[] = []
  const now = new Date()

  for (let i = months - 1; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)

    const agg = await prisma.payment.aggregate({
      where: {
        organizationId: orgId,
        status: "COMPLETED",
        createdAt: { gte: start, lt: end },
      },
      _sum: { amount: true },
    })

    results.push({
      month: start.toLocaleDateString("es", { month: "short" }),
      revenue: agg._sum.amount ?? 0,
    })
  }

  return results
}

export async function getPopularClasses(limit = 5) {
  const session = await auth()
  if (!session?.user?.organizationId) return []
  const orgId = session.user.organizationId

  const classes = await prisma.class.findMany({
    where: { organizationId: orgId },
    include: {
      schedules: {
        include: {
          sessions: {
            include: { _count: { select: { bookings: true } } },
          },
        },
      },
    },
  })

  const ranked = classes
    .map((c) => ({
      name: c.name,
      bookings: c.schedules.reduce(
        (acc, s) =>
          acc + s.sessions.reduce((a, sess) => a + sess._count.bookings, 0),
        0
      ),
    }))
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, limit)

  return ranked
}
