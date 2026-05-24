import type { Class, Schedule, ClassSession, Room, User } from "@prisma/client"

export type ClassWithSchedules = Class & {
  schedules: Schedule[]
}

export type ScheduleWithRelations = Schedule & {
  class: Class
  teacher: Pick<User, "id" | "name" | "avatar">
  room: Room | null
  sessions: ClassSession[]
}

export type ClassSessionWithDetails = ClassSession & {
  schedule: Schedule & {
    class: Class
    teacher: Pick<User, "id" | "name" | "avatar">
    room: Room | null
  }
}

export type WeekDay = {
  date: Date
  dayOfWeek: number
  sessions: ClassSessionWithDetails[]
}
