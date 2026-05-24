import { notFound } from "next/navigation"
import { getPublicFunnel } from "@/modules/funnels/actions/funnel-actions"
import { FunnelRenderer } from "@/modules/funnels/components/renderer/funnel-renderer"
import type { Block } from "@/modules/funnels/lib/block-types"

interface Props {
  params: Promise<{ slug: string }>
}

export default async function FunnelPage({ params }: Props) {
  const { slug } = await params
  const funnel = await getPublicFunnel(slug)

  if (!funnel) {
    notFound()
  }

  const blocks = (funnel.blocks as unknown as Block[]) || []

  return (
    <div className="min-h-screen bg-background">
      <FunnelRenderer blocks={blocks} />
    </div>
  )
}
