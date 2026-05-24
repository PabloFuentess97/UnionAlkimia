"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { membershipPlanSchema } from "@/lib/validators"
import type { ActionResult } from "@/types"
import type { MembershipPlan } from "@prisma/client"

export async function getPlans(): Promise<MembershipPlan[]> {
  const session = await auth()
  if (!session?.user?.organizationId) return []

  return prisma.membershipPlan.findMany({
    where: { organizationId: session.user.organizationId, isActive: true },
    orderBy: { sortOrder: "asc" },
  })
}

export async function getPublicPlans(orgId: string): Promise<MembershipPlan[]> {
  return prisma.membershipPlan.findMany({
    where: { organizationId: orgId, isActive: true },
    orderBy: { sortOrder: "asc" },
  })
}

export async function createPlan(input: unknown): Promise<ActionResult<MembershipPlan>> {
  const session = await auth()
  if (!session?.user?.organizationId) {
    return { success: false, error: "No autorizado" }
  }
  if (session.user.role !== "ORG_ADMIN" && session.user.role !== "SUPER_ADMIN") {
    return { success: false, error: "Sin permisos" }
  }

  const parsed = membershipPlanSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const created = await prisma.membershipPlan.create({
    data: {
      ...parsed.data,
      organizationId: session.user.organizationId,
    },
  })

  return { success: true, data: created }
}

export async function deletePlan(id: string): Promise<ActionResult<null>> {
  const session = await auth()
  if (!session?.user?.organizationId) {
    return { success: false, error: "No autorizado" }
  }

  await prisma.membershipPlan.update({
    where: { id },
    data: { isActive: false },
  })

  return { success: true, data: null }
}
