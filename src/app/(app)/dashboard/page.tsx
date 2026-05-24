import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { CalendarDays, CreditCard, Clock, MessageSquare } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import { UpcomingClassesWidget } from "./components/upcoming-classes-widget"
import { MembershipStatusWidget } from "./components/membership-status-widget"
import { AttendanceStats } from "./components/attendance-stats"
import { CommunityPreview } from "./components/community-preview"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id || !session.user.organizationId) return null

  const userId = session.user.id
  const orgId = session.user.organizationId

  const [upcomingBookings, membership, recentPosts, monthlyAttendance] =
    await Promise.all([
      prisma.booking.findMany({
        where: {
          userId,
          organizationId: orgId,
          status: "CONFIRMED",
          session: { date: { gte: new Date() } },
        },
        include: {
          session: {
            include: { schedule: { include: { class: true, room: true } } },
          },
        },
        orderBy: { session: { date: "asc" } },
        take: 5,
      }),
      prisma.membership.findFirst({
        where: { userId, organizationId: orgId, status: "ACTIVE" },
        include: { plan: true },
      }),
      prisma.communityPost.findMany({
        where: { organizationId: orgId },
        include: { author: { select: { name: true, avatar: true } } },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      prisma.booking.count({
        where: {
          userId,
          organizationId: orgId,
          status: "CHECKED_IN",
          session: {
            date: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
        },
      }),
    ])

  const quickActions = [
    { label: "Reservar clase", href: "/reservas", icon: CalendarDays },
    { label: "Ver horarios", href: "/horarios", icon: Clock },
    { label: "Mi membresia", href: "/membresias", icon: CreditCard },
    { label: "Comunidad", href: "/comunidad", icon: MessageSquare },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Hola, {session.user.name?.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">
          Bienvenido a tu espacio de bienestar
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex flex-col items-center gap-2 rounded-xl border p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <action.icon className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium">{action.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <UpcomingClassesWidget bookings={upcomingBookings} />
        <MembershipStatusWidget membership={membership} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AttendanceStats count={monthlyAttendance} />
        <CommunityPreview posts={recentPosts} />
      </div>
    </div>
  )
}
