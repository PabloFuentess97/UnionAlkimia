import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin - Configuración",
}

export default function AdminConfiguracionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuración</h1>
        <p className="text-muted-foreground">
          Ajustes de la organización
        </p>
      </div>
      <div className="rounded-xl border p-8 text-center text-muted-foreground">
        La configuración de la organización se gestionará aquí.
      </div>
    </div>
  )
}
