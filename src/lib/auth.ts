import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import { compareSync } from "bcryptjs"
import { prisma } from "./db"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: {
            memberships: {
              where: { isActive: true },
              include: { organization: true },
              take: 1,
            },
          },
        })

        if (!user || !user.hashedPassword) return null

        const isValid = compareSync(
          credentials.password as string,
          user.hashedPassword
        )

        if (!isValid) return null

        const member = user.memberships[0]

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar,
          role: member?.role ?? "STUDENT",
          organizationId: member?.organizationId ?? "",
          organizationName: member?.organization?.name ?? "",
        }
      },
    }),
  ],
})
