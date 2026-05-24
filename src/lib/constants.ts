export const APP_NAME = "Union Alkimia"
export const APP_DESCRIPTION = "Plataforma de gestión para estudios de yoga y wellness"

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ORG_ADMIN: "ORG_ADMIN",
  TEACHER: "TEACHER",
  STUDENT: "STUDENT",
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const BOOKING_STATUS = {
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
  WAITLISTED: "WAITLISTED",
  CHECKED_IN: "CHECKED_IN",
  NO_SHOW: "NO_SHOW",
} as const

export const MEMBERSHIP_STATUS = {
  ACTIVE: "ACTIVE",
  PAST_DUE: "PAST_DUE",
  CANCELLED: "CANCELLED",
  PAUSED: "PAUSED",
  TRIALING: "TRIALING",
} as const

export const PAYMENT_PROVIDER = {
  STRIPE: "STRIPE",
  PAYPAL: "PAYPAL",
  MANUAL: "MANUAL",
} as const

export const SESSION_STATUS = {
  SCHEDULED: "SCHEDULED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const

export const RECURRENCE = {
  WEEKLY: "WEEKLY",
  BIWEEKLY: "BIWEEKLY",
  MONTHLY: "MONTHLY",
  ONCE: "ONCE",
} as const

export const PLAN_INTERVAL = {
  MONTHLY: "MONTHLY",
  QUARTERLY: "QUARTERLY",
  YEARLY: "YEARLY",
  ONE_TIME: "ONE_TIME",
} as const
