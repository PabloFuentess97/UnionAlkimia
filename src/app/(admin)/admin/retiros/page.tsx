import { getRetreats } from "@/modules/retreats/actions/retreat-actions"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin - Retiros",
}

export default async function AdminRetirosPage() {
  const retreats = await getRetreats()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Retiros</h1>
          <p className="text-muted-foreground">{retreats.length} retiros</p>
        </div>
      </div>

      {retreats.length === 0 ? (
        <div className="rounded-xl border p-8 text-center text-muted-foreground">
          No hay retiros creados.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {retreats.map((retreat) => (
            <div key={retreat.id} className="rounded-xl border p-5">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold">{retreat.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  retreat.isPublished ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {retreat.isPublished ? "Publicado" : "Borrador"}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{retreat.location}</p>
              <p className="mt-2 text-sm">
                {formatDate(retreat.startDate)} — {formatDate(retreat.endDate)}
              </p>
              <p className="mt-2 font-semibold">{formatCurrency(retreat.price)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
