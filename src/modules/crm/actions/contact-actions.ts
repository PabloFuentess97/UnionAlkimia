"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { contactSchema } from "@/lib/validators"
import type { ActionResult, PaginatedResult } from "@/types"
import type { CrmContact } from "@prisma/client"

export async function getContacts(params?: {
  page?: number
  search?: string
  tag?: string
}): Promise<PaginatedResult<CrmContact>> {
  const session = await auth()
  if (!session?.user?.organizationId) {
    return { data: [], total: 0, page: 1, pageSize: 20, totalPages: 0 }
  }

  const page = params?.page ?? 1
  const pageSize = 20
  const skip = (page - 1) * pageSize

  const where: Record<string, unknown> = {
    organizationId: session.user.organizationId,
  }

  if (params?.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { email: { contains: params.search, mode: "insensitive" } },
      { phone: { contains: params.search } },
    ]
  }

  if (params?.tag) {
    where.tags = { array_contains: [params.tag] }
  }

  const [data, total] = await Promise.all([
    prisma.crmContact.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.crmContact.count({ where }),
  ])

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

export async function createContact(input: unknown): Promise<ActionResult<CrmContact>> {
  const session = await auth()
  if (!session?.user?.organizationId) {
    return { success: false, error: "No autorizado" }
  }

  const parsed = contactSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const existing = await prisma.crmContact.findUnique({
    where: {
      organizationId_email: {
        organizationId: session.user.organizationId,
        email: parsed.data.email,
      },
    },
  })

  if (existing) {
    return { success: false, error: "Ya existe un contacto con este email" }
  }

  const contact = await prisma.crmContact.create({
    data: {
      ...parsed.data,
      organizationId: session.user.organizationId,
    },
  })

  return { success: true, data: contact }
}

export async function updateContact(
  id: string,
  input: unknown
): Promise<ActionResult<CrmContact>> {
  const session = await auth()
  if (!session?.user?.organizationId) {
    return { success: false, error: "No autorizado" }
  }

  const parsed = contactSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const contact = await prisma.crmContact.update({
    where: { id },
    data: parsed.data,
  })

  return { success: true, data: contact }
}

export async function addTag(
  contactId: string,
  tag: string
): Promise<ActionResult<CrmContact>> {
  const session = await auth()
  if (!session?.user?.organizationId) {
    return { success: false, error: "No autorizado" }
  }

  const contact = await prisma.crmContact.findFirst({
    where: { id: contactId, organizationId: session.user.organizationId },
  })

  if (!contact) {
    return { success: false, error: "Contacto no encontrado" }
  }

  const currentTags = (contact.tags as string[]) || []
  if (currentTags.includes(tag)) {
    return { success: true, data: contact }
  }

  const updated = await prisma.crmContact.update({
    where: { id: contactId },
    data: { tags: [...currentTags, tag] },
  })

  return { success: true, data: updated }
}

export async function deleteContact(id: string): Promise<ActionResult<null>> {
  const session = await auth()
  if (!session?.user?.organizationId) {
    return { success: false, error: "No autorizado" }
  }

  await prisma.crmContact.delete({ where: { id } })
  return { success: true, data: null }
}
