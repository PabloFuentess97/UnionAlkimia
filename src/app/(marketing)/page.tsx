import Link from "next/link"
import { CalendarDays, Users, CreditCard, Mountain, Layers, BarChart3 } from "lucide-react"

const features = [
  {
    icon: CalendarDays,
    title: "Reservas inteligentes",
    description: "Sistema de reservas con lista de espera automática y check-in QR.",
  },
  {
    icon: Users,
    title: "Comunidad privada",
    description: "Espacio exclusivo para tus alumnos. Comparte contenido y conecta.",
  },
  {
    icon: CreditCard,
    title: "Membresías y pagos",
    description: "Suscripciones recurrentes con Stripe y PayPal. Facturación automática.",
  },
  {
    icon: Mountain,
    title: "Gestión de retiros",
    description: "Organiza retiros con reservas, pagos y gestión de participantes.",
  },
  {
    icon: Layers,
    title: "Page Builder",
    description: "Crea landing pages y funnels de conversión sin escribir código.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Métricas en tiempo real: ingresos, reservas, retención y más.",
  },
]

export default function HomePage() {
  return (
    <div>
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            La plataforma completa para tu{" "}
            <span className="text-primary">estudio de yoga</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Gestiona reservas, membresías, comunidad y retiros desde un solo lugar.
            Diseñada para estudios de yoga, pilates y centros wellness.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/registro"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Empezar gratis
            </Link>
            <Link
              href="/precios"
              className="rounded-lg border px-6 py-3 text-sm font-medium hover:bg-muted transition-colors"
            >
              Ver precios
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-3xl font-bold">Todo lo que necesitas</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            Una plataforma diseñada específicamente para estudios de yoga y bienestar.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-3xl font-bold">¿Listo para transformar tu estudio?</h2>
          <p className="mt-4 text-muted-foreground">
            Únete a los estudios que ya gestionan todo desde Union Alkimia.
          </p>
          <Link
            href="/registro"
            className="mt-8 inline-block rounded-lg bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Crear mi cuenta gratis
          </Link>
        </div>
      </section>
    </div>
  )
}
