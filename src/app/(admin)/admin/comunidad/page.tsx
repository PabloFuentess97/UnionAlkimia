import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin - Comunidad",
}

export default function AdminComunidadPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Moderación de Comunidad</h1>
        <p className="text-muted-foreground">
          Gestiona posts y contenido de la comunidad
        </p>
      </div>
      <div className="rounded-xl border p-8 text-center text-muted-foreground">
        Las herramientas de moderación se mostrarán aquí.
      </div>
    </div>
  )
}
