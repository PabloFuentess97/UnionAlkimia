import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const path = nextUrl.pathname

      const publicRoutes = ["/", "/precios", "/blog", "/contacto", "/f"]
      const authRoutes = ["/login", "/registro", "/recuperar"]
      const adminRoutes = ["/admin"]

      const isPublicRoute = publicRoutes.some(
        (route) => path === route || path.startsWith(`${route}/`)
      )
      const isAuthRoute = authRoutes.some(
        (route) => path === route || path.startsWith(`${route}/`)
      )
      const isAdminRoute = adminRoutes.some((route) => path.startsWith(route))
      const isApiRoute = path.startsWith("/api")

      if (isApiRoute || isPublicRoute) return true

      if (isAuthRoute) {
        if (isLoggedIn) return Response.redirect(new URL("/dashboard", nextUrl))
        return true
      }

      if (!isLoggedIn) {
        return Response.redirect(
          new URL(`/login?callbackUrl=${encodeURIComponent(path)}`, nextUrl)
        )
      }

      if (isAdminRoute) {
        const role = auth?.user?.role
        if (role !== "ORG_ADMIN" && role !== "SUPER_ADMIN") {
          return Response.redirect(new URL("/dashboard", nextUrl))
        }
      }

      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role
        token.organizationId = (user as { organizationId?: string }).organizationId
        token.organizationName = (user as { organizationName?: string }).organizationName
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.organizationId = token.organizationId as string
        session.user.organizationName = token.organizationName as string
      }
      return session
    },
  },
  providers: [],
} satisfies NextAuthConfig
