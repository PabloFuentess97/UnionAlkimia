export function AttendanceStats({ count }: { count: number }) {
  const currentMonth = new Date().toLocaleDateString("es", { month: "long" })

  return (
    <div className="rounded-xl border p-6">
      <h2 className="font-semibold mb-4">Mi progreso</h2>
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <span className="text-2xl font-bold text-primary">{count}</span>
        </div>
        <div>
          <p className="text-sm font-medium">
            {count === 1 ? "clase asistida" : "clases asistidas"}
          </p>
          <p className="text-xs text-muted-foreground capitalize">
            en {currentMonth}
          </p>
        </div>
      </div>
    </div>
  )
}
