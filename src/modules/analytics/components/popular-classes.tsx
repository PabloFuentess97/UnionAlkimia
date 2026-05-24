interface PopularClassesProps {
  data: { name: string; bookings: number }[]
}

export function PopularClasses({ data }: PopularClassesProps) {
  const max = Math.max(...data.map((d) => d.bookings), 1)

  return (
    <div className="rounded-xl border p-6">
      <h3 className="font-semibold mb-4">Clases mas populares</h3>
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin datos disponibles</p>
      ) : (
        <ul className="space-y-3">
          {data.map((item) => (
            <li key={item.name}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-medium">{item.name}</span>
                <span className="text-muted-foreground">
                  {item.bookings} reservas
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${(item.bookings / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
