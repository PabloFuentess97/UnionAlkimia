interface StatCardProps {
  label: string
  value: string | number
  change?: number
}

export function StatCard({ label, value, change }: StatCardProps) {
  return (
    <div className="rounded-xl border p-6">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {change !== undefined && (
        <p
          className={`mt-1 text-xs font-medium ${
            change >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {change >= 0 ? "+" : ""}
          {change.toFixed(1)}% vs mes anterior
        </p>
      )}
    </div>
  )
}
