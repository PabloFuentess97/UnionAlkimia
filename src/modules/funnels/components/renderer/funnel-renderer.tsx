"use client"

import type { Block } from "../../lib/block-types"
import { BlockRenderer } from "./block-renderer"

interface FunnelRendererProps {
  blocks: Block[]
}

export function FunnelRenderer({ blocks }: FunnelRendererProps) {
  if (blocks.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
        Este funnel no tiene contenido todavía.
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  )
}
