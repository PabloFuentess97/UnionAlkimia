import { describe, it, expect } from "vitest"
import {
  getWeekDates,
  shouldGenerateSession,
  isSameDay,
  getDayName,
  formatTimeRange,
} from "@/modules/schedules/lib/schedule-utils"

describe("getDayName", () => {
  it("returns correct day names in Spanish", () => {
    expect(getDayName(0)).toBe("Lunes")
    expect(getDayName(4)).toBe("Viernes")
    expect(getDayName(6)).toBe("Domingo")
  })
})

describe("formatTimeRange", () => {
  it("formats a time range", () => {
    expect(formatTimeRange("09:00", "10:00")).toBe("09:00 - 10:00")
  })
})

describe("isSameDay", () => {
  it("returns true for same day", () => {
    const a = new Date("2026-03-15T10:00:00")
    const b = new Date("2026-03-15T22:00:00")
    expect(isSameDay(a, b)).toBe(true)
  })

  it("returns false for different days", () => {
    const a = new Date("2026-03-15")
    const b = new Date("2026-03-16")
    expect(isSameDay(a, b)).toBe(false)
  })
})

describe("getWeekDates", () => {
  it("returns 7 dates starting from Monday", () => {
    const dates = getWeekDates(new Date("2026-03-18")) // Wednesday
    expect(dates).toHaveLength(7)
    expect(dates[0].getDay()).toBe(1) // Monday
  })
})

describe("shouldGenerateSession", () => {
  it("returns true for weekly within range", () => {
    const start = new Date("2026-01-06") // Monday
    const target = new Date("2026-01-13") // next Monday
    expect(shouldGenerateSession(start, null, target, "WEEKLY")).toBe(true)
  })

  it("returns false before start date", () => {
    const start = new Date("2026-01-06")
    const target = new Date("2026-01-01")
    expect(shouldGenerateSession(start, null, target, "WEEKLY")).toBe(false)
  })

  it("returns false after end date", () => {
    const start = new Date("2026-01-06")
    const end = new Date("2026-01-20")
    const target = new Date("2026-01-27")
    expect(shouldGenerateSession(start, end, target, "WEEKLY")).toBe(false)
  })
})
