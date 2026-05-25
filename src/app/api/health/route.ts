import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const checks: Record<string, boolean> = {}

  // Database check
  try {
    const { prisma } = await import("@/lib/db")
    await prisma.$queryRaw`SELECT 1`
    checks.database = true
  } catch {
    checks.database = false
  }

  // Redis check
  try {
    const { redis } = await import("@/lib/redis")
    await redis.ping()
    checks.redis = true
  } catch {
    checks.redis = false
  }

  const healthy = Object.values(checks).every(Boolean)

  return NextResponse.json(
    { status: healthy ? "healthy" : "degraded", checks, timestamp: new Date().toISOString() },
    { status: healthy ? 200 : 503 }
  )
}
