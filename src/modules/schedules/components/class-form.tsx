"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { classSchema, type ClassInput } from "@/lib/validators"
import { createClass, updateClass } from "../actions/class-actions"
import type { Class } from "@prisma/client"

interface ClassFormProps {
  initialData?: Class
  onSuccess?: () => void
}

export function ClassForm({ initialData, onSuccess }: ClassFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassInput>({
    resolver: zodResolver(classSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description ?? "",
          duration: initialData.duration,
          maxCapacity: initialData.maxCapacity,
          color: initialData.color ?? "",
          isOnline: initialData.isOnline,
          meetingUrl: initialData.meetingUrl ?? "",
        }
      : { duration: 60, maxCapacity: 15, isOnline: false },
  })

  async function onSubmit(data: ClassInput) {
    setLoading(true)
    setError(null)

    const result = initialData
      ? await updateClass(initialData.id, data)
      : await createClass(data)

    if (!result.success) {
      setError(result.error)
      setLoading(false)
      return
    }

    setLoading(false)
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nombre</label>
        <input
          {...register("name")}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          placeholder="Hatha Yoga"
        />
        {errors.name && (
          <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <textarea
          {...register("description")}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          rows={3}
          placeholder="Descripción de la clase..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Duración (min)</label>
          <input
            {...register("duration", { valueAsNumber: true })}
            type="number"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
          {errors.duration && (
            <p className="text-sm text-destructive mt-1">{errors.duration.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Capacidad máx.</label>
          <input
            {...register("maxCapacity", { valueAsNumber: true })}
            type="number"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
          {errors.maxCapacity && (
            <p className="text-sm text-destructive mt-1">{errors.maxCapacity.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Color</label>
        <input
          {...register("color")}
          type="color"
          className="h-10 w-20 rounded border border-input"
          defaultValue="#22c55e"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          {...register("isOnline")}
          type="checkbox"
          id="isOnline"
          className="rounded border-input"
        />
        <label htmlFor="isOnline" className="text-sm">Clase online</label>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {loading
          ? "Guardando..."
          : initialData
          ? "Actualizar clase"
          : "Crear clase"}
      </button>
    </form>
  )
}
