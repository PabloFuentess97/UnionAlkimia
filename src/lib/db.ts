import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })
}

export const prisma = globalForPrisma.prisma || createPrismaClient()

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
