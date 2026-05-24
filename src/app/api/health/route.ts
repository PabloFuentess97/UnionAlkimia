import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { redis } from "@/lib/redis"

export async function GET() {
  const checks: Record<string, boolean> = {}

  try {
    await prisma.$queryRaw`SELECT 1`
    checks.database = true
  } catch {
    checks.database = false
  }

  try {
    await redis.ping()
    checks.redis = true
  } catch {
    checks.redis = false
  }

  const healthy = Object.values(checks).every(Boolean)

  return NextResponse.json(
    { status: healthy ? "healthy" : "degraded", checks },
    { status: healthy ? 200 : 503 }
  )
}
