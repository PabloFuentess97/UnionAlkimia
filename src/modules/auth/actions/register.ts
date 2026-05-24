"use server"

import { hashSync } from "bcryptjs"
import { prisma } from "@/lib/db"
import { registerSchema } from "@/lib/validators"
import type { ActionResult } from "@/types"

export async function registerUser(
  input: unknown
): Promise<ActionResult<{ userId: string }>> {
  const parsed = registerSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const { name, email, password } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return { success: false, error: "Este email ya está registrado" }
  }

  const hashedPassword = hashSync(password, 12)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword,
      emailVerified: new Date(),
    },
  })

  const defaultOrg = await prisma.organization.findFirst({
    where: { isActive: true },
  })

  if (defaultOrg) {
    await prisma.organizationMember.create({
      data: {
        userId: user.id,
        organizationId: defaultOrg.id,
        role: "STUDENT",
      },
    })
  }

  return { success: true, data: { userId: user.id } }
}
