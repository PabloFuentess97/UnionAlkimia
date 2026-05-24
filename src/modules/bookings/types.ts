import type { Booking, ClassSession, Schedule, Class, User, Room } from "@prisma/client"

export type BookingWithSession = Booking & {
  session: ClassSession & {
    schedule: Schedule & {
      class: Class
      teacher: Pick<User, "id" | "name" | "avatar">
      room: Room | null
    }
  }
}

export type BookingWithUser = Booking & {
  user: Pick<User, "id" | "name" | "email" | "avatar">
}
