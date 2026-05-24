import { z } from "zod"

export const emailSchema = z.string().email("Email inválido")

export const passwordSchema = z
  .string()
  .min(8, "Mínimo 8 caracteres")
  .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
  .regex(/[0-9]/, "Debe contener al menos un número")

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Contraseña requerida"),
})

export const registerSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

export const classSchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  description: z.string().optional(),
  duration: z.number().min(15).max(180),
  maxCapacity: z.number().min(1).max(100),
  color: z.string().optional(),
  isOnline: z.boolean(),
  meetingUrl: z.string().url().optional().or(z.literal("")),
})

export const scheduleSchema = z.object({
  classId: z.string().uuid(),
  teacherId: z.string().uuid(),
  roomId: z.string().uuid().optional(),
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  recurrence: z.enum(["WEEKLY", "BIWEEKLY", "MONTHLY", "ONCE"]),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
})

export const membershipPlanSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().min(0),
  currency: z.string().default("EUR"),
  interval: z.enum(["MONTHLY", "QUARTERLY", "YEARLY", "ONE_TIME"]),
  classesPerMonth: z.number().min(1).optional(),
  features: z.array(z.string()).default([]),
})

export const communityPostSchema = z.object({
  content: z.string().min(1, "El contenido no puede estar vacío").max(5000),
  mediaUrls: z.array(z.string().url()).optional(),
})

export const contactSchema = z.object({
  email: emailSchema,
  name: z.string().min(2),
  phone: z.string().optional(),
  tags: z.array(z.string()).default([]),
  notes: z.string().optional(),
  source: z.string().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ClassInput = z.infer<typeof classSchema>
export type ScheduleInput = z.infer<typeof scheduleSchema>
export type MembershipPlanInput = z.infer<typeof membershipPlanSchema>
export type CommunityPostInput = z.infer<typeof communityPostSchema>
export type ContactInput = z.infer<typeof contactSchema>
