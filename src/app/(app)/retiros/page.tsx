import { getPublicRetreats } from "@/modules/retreats/actions/retreat-actions"
import { formatCurrency, formatDate } from "@/lib/utils"
import { MapPin, Calendar, Users } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Retiros",
}

export default async function RetirosPage() {
  const retreats = await getPublicRetreats()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Retiros</h1>
        <p className="text-muted-foreground">
          Experiencias transformadoras de yoga y bienestar
        </p>
      </div>

      {retreats.length === 0 ? (
        <div className="rounded-xl border p-8 text-center text-muted-foreground">
          No hay retiros programados actualmente.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {retreats.map((retreat) => (
            <div key={retreat.id} className="rounded-xl border overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 bg-gradient-to-br from-primary/20 to-accent/20" />
              <div className="p-5">
                <h3 className="text-lg font-semibold">{retreat.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {retreat.description}
                </p>
                <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {retreat.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(retreat.startDate)} — {formatDate(retreat.endDate)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Máx. {retreat.maxParticipants} participantes
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold">
                    {formatCurrency(retreat.price, retreat.currency)}
                  </span>
                  <Link
                    href={`/retiros/${retreat.id}`}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Ver más
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
