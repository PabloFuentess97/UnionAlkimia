import type { Membership, MembershipPlan, User, Payment } from "@prisma/client"

export type MembershipWithPlan = Membership & {
  plan: MembershipPlan
}

export type MembershipWithUser = Membership & {
  user: Pick<User, "id" | "name" | "email">
  plan: MembershipPlan
}

export type PaymentWithDetails = Payment & {
  user: Pick<User, "id" | "name" | "email">
}
