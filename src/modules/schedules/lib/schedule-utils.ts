import type { Recurrence } from "@prisma/client"

export function getWeekDates(baseDate: Date = new Date()): Date[] {
  const start = new Date(baseDate)
  const day = start.getDay()
  const diff = day === 0 ? -6 : 1 - day
  start.setDate(start.getDate() + diff)
  start.setHours(0, 0, 0, 0)

  const dates: Date[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    dates.push(d)
  }
  return dates
}

export function shouldGenerateSession(
  scheduleStartDate: Date,
  scheduleEndDate: Date | null,
  targetDate: Date,
  recurrence: Recurrence
): boolean {
  if (targetDate < scheduleStartDate) return false
  if (scheduleEndDate && targetDate > scheduleEndDate) return false

  if (recurrence === "ONCE") {
    return isSameDay(targetDate, scheduleStartDate)
  }

  if (recurrence === "WEEKLY") return true

  if (recurrence === "BIWEEKLY") {
    const diffDays = Math.floor(
      (targetDate.getTime() - scheduleStartDate.getTime()) / (1000 * 60 * 60 * 24)
    )
    const diffWeeks = Math.floor(diffDays / 7)
    return diffWeeks % 2 === 0
  }

  if (recurrence === "MONTHLY") {
    return targetDate.getDate() === scheduleStartDate.getDate()
  }

  return false
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function formatTimeRange(start: string, end: string): string {
  return `${start} - ${end}`
}

export function getDayName(dayOfWeek: number): string {
  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
  return days[dayOfWeek] ?? ""
}

export function getDayNameShort(dayOfWeek: number): string {
  const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
  return days[dayOfWeek] ?? ""
}
