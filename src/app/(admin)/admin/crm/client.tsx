"use client"

import { useState } from "react"
import { Search, Plus, Tag } from "lucide-react"
import type { CrmContact } from "@prisma/client"
import type { PaginatedResult } from "@/types"

interface Props {
  initialData: PaginatedResult<CrmContact>
}

export function CrmClientPage({ initialData }: Props) {
  const [contacts] = useState(initialData.data)
  const [search, setSearch] = useState("")

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">CRM</h1>
          <p className="text-muted-foreground">
            {initialData.total} contactos
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Nuevo contacto
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border p-8 text-center text-muted-foreground">
          No hay contactos.
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Nombre</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Teléfono</th>
                <th className="px-4 py-3 text-left font-medium">Etiquetas</th>
                <th className="px-4 py-3 text-left font-medium">Fuente</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((contact) => (
                <tr key={contact.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{contact.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{contact.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {contact.phone || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {((contact.tags as string[]) || []).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {contact.source || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
