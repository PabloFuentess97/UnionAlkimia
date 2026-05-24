"use client"

import { useSession } from "next-auth/react"

export function useCurrentOrg() {
  const { data: session } = useSession()

  return {
    organizationId: session?.user?.organizationId ?? null,
    organizationName: session?.user?.organizationName ?? null,
  }
}
