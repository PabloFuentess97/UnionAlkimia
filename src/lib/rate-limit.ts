import { RateLimiterRedis } from "rate-limiter-flexible"
import { redis } from "./redis"
import { NextResponse } from "next/server"

const loginLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "rl_login",
  points: 5,
  duration: 900, // 15 min
  blockDuration: 900,
})

const registerLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "rl_register",
  points: 3,
  duration: 3600, // 1 hour
})

const apiLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "rl_api",
  points: 100,
  duration: 60,
})

export async function checkRateLimit(
  type: "login" | "register" | "api",
  key: string
): Promise<{ allowed: boolean; retryAfter?: number }> {
  const limiter =
    type === "login"
      ? loginLimiter
      : type === "register"
      ? registerLimiter
      : apiLimiter

  try {
    await limiter.consume(key)
    return { allowed: true }
  } catch (res) {
    const result = res as { msBeforeNext?: number }
    return {
      allowed: false,
      retryAfter: Math.ceil((result.msBeforeNext ?? 60000) / 1000),
    }
  }
}

export function rateLimitResponse(retryAfter: number) {
  return NextResponse.json(
    { error: "Too many requests" },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfter) },
    }
  )
}
