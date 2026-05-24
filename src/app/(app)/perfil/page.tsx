import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mi Perfil",
}

export default function PerfilPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mi Perfil</h1>
      <p className="text-muted-foreground">
        Gestiona tu información personal.
      </p>
      <div className="rounded-xl border p-8 text-center text-muted-foreground">
        El formulario de perfil se mostrará aquí.
      </div>
    </div>
  )
}
