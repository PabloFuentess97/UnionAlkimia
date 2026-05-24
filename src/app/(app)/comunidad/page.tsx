import type { Metadata } from "next"
import { PostFeed } from "@/modules/community/components/post-feed"

export const metadata: Metadata = {
  title: "Comunidad",
}

export default function ComunidadPage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Comunidad</h1>
        <p className="text-muted-foreground">
          Conecta con otros alumnos del estudio
        </p>
      </div>
      <PostFeed />
    </div>
  )
}
