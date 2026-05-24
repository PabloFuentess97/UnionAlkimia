import { describe, it, expect } from "vitest"
import { loginSchema, registerSchema, classSchema } from "@/lib/validators"

describe("loginSchema", () => {
  it("validates correct credentials", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "password123",
    })
    expect(result.success).toBe(true)
  })

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    })
    expect(result.success).toBe(false)
  })

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "",
    })
    expect(result.success).toBe(false)
  })
})

describe("registerSchema", () => {
  it("validates correct registration", () => {
    const result = registerSchema.safeParse({
      name: "Test User",
      email: "test@example.com",
      password: "Password123",
      confirmPassword: "Password123",
    })
    expect(result.success).toBe(true)
  })

  it("rejects mismatched passwords", () => {
    const result = registerSchema.safeParse({
      name: "Test User",
      email: "test@example.com",
      password: "Password123",
      confirmPassword: "Different123",
    })
    expect(result.success).toBe(false)
  })

  it("rejects missing name", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    })
    expect(result.success).toBe(false)
  })
})

describe("classSchema", () => {
  it("validates a valid class", () => {
    const result = classSchema.safeParse({
      name: "Hatha Yoga",
      duration: 60,
      maxCapacity: 15,
      isOnline: false,
    })
    expect(result.success).toBe(true)
  })

  it("rejects duration under 15", () => {
    const result = classSchema.safeParse({
      name: "Quick",
      duration: 5,
      maxCapacity: 10,
      isOnline: false,
    })
    expect(result.success).toBe(false)
  })

  it("rejects capacity over 100", () => {
    const result = classSchema.safeParse({
      name: "Mega Class",
      duration: 60,
      maxCapacity: 200,
      isOnline: true,
    })
    expect(result.success).toBe(false)
  })
})
