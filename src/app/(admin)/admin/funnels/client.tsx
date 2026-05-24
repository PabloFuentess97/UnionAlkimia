"use client"

import { useState } from "react"
import { Plus, ExternalLink, Eye } from "lucide-react"
import Link from "next/link"
import { createFunnel } from "@/modules/funnels/actions/funnel-actions"
import type { Funnel } from "@prisma/client"

interface Props {
  funnels: Funnel[]
}

export function FunnelsListClient({ funnels: initialFunnels }: Props) {
  const [funnels, setFunnels] = useState(initialFunnels)
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    if (!name.trim()) return
    setLoading(true)
    const result = await createFunnel(name)
    if (result.success) {
      setFunnels((prev) => [result.data, ...prev])
      setName("")
      setShowCreate(false)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Funnels</h1>
          <p className="text-muted-foreground">
            Crea landing pages y funnels de conversión
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Nuevo funnel
        </button>
      </div>

      {showCreate && (
        <div className="rounded-xl border p-4 flex gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del funnel..."
            className="flex-1 rounded-lg border border-input px-3 py-2 text-sm"
            autoFocus
          />
          <button
            onClick={handleCreate}
            disabled={loading || !name.trim()}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {loading ? "..." : "Crear"}
          </button>
          <button
            onClick={() => setShowCreate(false)}
            className="rounded-lg border px-4 py-2 text-sm"
          >
            Cancelar
          </button>
        </div>
      )}

      {funnels.length === 0 ? (
        <div className="rounded-xl border p-8 text-center text-muted-foreground">
          No tienes funnels. Crea el primero para empezar.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {funnels.map((funnel) => (
            <div key={funnel.id} className="rounded-xl border p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{funnel.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    /f/{funnel.slug}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    funnel.status === "PUBLISHED"
                      ? "bg-green-100 text-green-700"
                      : funnel.status === "DRAFT"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {funnel.status === "PUBLISHED" ? "Publicado" : funnel.status === "DRAFT" ? "Borrador" : "Archivado"}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <span><Eye className="inline h-3 w-3 mr-1" />{funnel.visits} visitas</span>
                <span>{funnel.conversions} conversiones</span>
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  href={`/admin/funnels/${funnel.id}`}
                  className="flex-1 rounded-md border px-3 py-1.5 text-center text-xs font-medium hover:bg-muted"
                >
                  Editar
                </Link>
                {funnel.status === "PUBLISHED" && (
                  <a
                    href={`/f/${funnel.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md border px-3 py-1.5 text-xs hover:bg-muted"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
