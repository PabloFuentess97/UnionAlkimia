import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export function getOrgPrisma(organizationId: string) {
  return prisma.$extends({
    query: {
      $allOperations({ args, query }) {
        const modifiedArgs = args as Record<string, unknown>
        if ("where" in (modifiedArgs || {})) {
          ;(modifiedArgs.where as Record<string, unknown>).organizationId = organizationId
        }
        return query(args)
      },
    },
  })
}

export function withOrg<T extends Record<string, unknown>>(data: T, organizationId: string) {
  return { ...data, organizationId }
}
