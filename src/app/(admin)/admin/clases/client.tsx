"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { ClassForm } from "@/modules/schedules/components/class-form"
import type { Class, Room } from "@prisma/client"

interface Props {
  initialClasses: Class[]
  initialRooms: Room[]
}

export function AdminClassesClient({ initialClasses, initialRooms }: Props) {
  const [classes, setClasses] = useState(initialClasses)
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clases</h1>
          <p className="text-muted-foreground">
            Gestiona los tipos de clase del estudio
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Nueva clase
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Crear nueva clase</h2>
          <ClassForm
            onSuccess={() => {
              setShowForm(false)
              window.location.reload()
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="rounded-xl border p-4 hover:shadow-sm transition-shadow"
            style={{ borderLeftColor: cls.color || "#22c55e", borderLeftWidth: "4px" }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{cls.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {cls.description || "Sin descripción"}
                </p>
              </div>
              {cls.isOnline && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  Online
                </span>
              )}
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <span>{cls.duration} min</span>
              <span>Máx. {cls.maxCapacity} alumnos</span>
            </div>
          </div>
        ))}
      </div>

      {classes.length === 0 && !showForm && (
        <div className="rounded-xl border p-8 text-center text-muted-foreground">
          No hay clases creadas. Crea la primera para empezar.
        </div>
      )}

      {initialRooms.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Salas</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {initialRooms.map((room) => (
              <div key={room.id} className="rounded-lg border p-3">
                <p className="font-medium">{room.name}</p>
                <p className="text-sm text-muted-foreground">
                  Capacidad: {room.capacity}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
