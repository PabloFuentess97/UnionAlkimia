import { getFunnels } from "@/modules/funnels/actions/funnel-actions"
import { FunnelsListClient } from "./client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Funnels",
}

export default async function AdminFunnelsPage() {
  const funnels = await getFunnels()
  return <FunnelsListClient funnels={funnels} />
}
