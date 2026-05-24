"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { generateSlug } from "@/lib/utils"
import type { ActionResult } from "@/types"
import type { Funnel } from "@prisma/client"
import type { Block } from "../lib/block-types"

export async function getFunnels(): Promise<Funnel[]> {
  const session = await auth()
  if (!session?.user?.organizationId) return []

  return prisma.funnel.findMany({
    where: { organizationId: session.user.organizationId },
    orderBy: { updatedAt: "desc" },
  })
}

export async function getFunnel(id: string): Promise<Funnel | null> {
  const session = await auth()
  if (!session?.user?.organizationId) return null

  return prisma.funnel.findFirst({
    where: { id, organizationId: session.user.organizationId },
  })
}

export async function createFunnel(name: string): Promise<ActionResult<Funnel>> {
  const session = await auth()
  if (!session?.user?.organizationId) {
    return { success: false, error: "No autorizado" }
  }

  const slug = generateSlug(name)

  const funnel = await prisma.funnel.create({
    data: {
      name,
      slug,
      organizationId: session.user.organizationId,
      blocks: [],
      settings: {},
    },
  })

  return { success: true, data: funnel }
}

export async function updateFunnelBlocks(
  id: string,
  blocks: Block[]
): Promise<ActionResult<Funnel>> {
  const session = await auth()
  if (!session?.user?.organizationId) {
    return { success: false, error: "No autorizado" }
  }

  const funnel = await prisma.funnel.update({
    where: { id },
    data: { blocks: JSON.parse(JSON.stringify(blocks)) },
  })

  return { success: true, data: funnel }
}

export async function publishFunnel(id: string): Promise<ActionResult<Funnel>> {
  const session = await auth()
  if (!session?.user?.organizationId) {
    return { success: false, error: "No autorizado" }
  }

  const funnel = await prisma.funnel.update({
    where: { id },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  })

  return { success: true, data: funnel }
}

export async function deleteFunnel(id: string): Promise<ActionResult<null>> {
  const session = await auth()
  if (!session?.user?.organizationId) {
    return { success: false, error: "No autorizado" }
  }

  await prisma.funnel.update({
    where: { id },
    data: { status: "ARCHIVED" },
  })

  return { success: true, data: null }
}

export async function submitFunnelForm(
  funnelId: string,
  formData: { email: string; name?: string; phone?: string; data?: Record<string, unknown> }
): Promise<ActionResult<null>> {
  const funnel = await prisma.funnel.findUnique({ where: { id: funnelId } })
  if (!funnel) {
    return { success: false, error: "Funnel no encontrado" }
  }

  await prisma.funnelLead.create({
    data: {
      organizationId: funnel.organizationId,
      funnelId,
      email: formData.email,
      name: formData.name,
      phone: formData.phone,
      data: formData.data as Parameters<typeof prisma.funnelLead.create>[0]["data"]["data"],
    },
  })

  await prisma.funnel.update({
    where: { id: funnelId },
    data: { conversions: { increment: 1 } },
  })

  await prisma.crmContact.upsert({
    where: {
      organizationId_email: {
        organizationId: funnel.organizationId,
        email: formData.email,
      },
    },
    update: { lastContactedAt: new Date() },
    create: {
      organizationId: funnel.organizationId,
      email: formData.email,
      name: formData.name || formData.email.split("@")[0],
      phone: formData.phone,
      source: `funnel:${funnel.slug}`,
      tags: ["lead"],
    },
  })

  return { success: true, data: null }
}

export async function getPublicFunnel(slug: string) {
  const funnel = await prisma.funnel.findFirst({
    where: { slug, status: "PUBLISHED" },
  })

  if (funnel) {
    await prisma.funnel.update({
      where: { id: funnel.id },
      data: { visits: { increment: 1 } },
    })
  }

  return funnel
}
