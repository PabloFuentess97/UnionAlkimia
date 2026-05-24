import {
  CalendarDays,
  Clock,
  CreditCard,
  Home,
  LayoutDashboard,
  MessageSquare,
  Mountain,
  Settings,
  Users,
  BarChart3,
  Layers,
  Contact,
  UserCircle,
} from "lucide-react"

export const appNavigation = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Reservas", href: "/reservas", icon: CalendarDays },
  { label: "Horarios", href: "/horarios", icon: Clock },
  { label: "Membresías", href: "/membresias", icon: CreditCard },
  { label: "Comunidad", href: "/comunidad", icon: MessageSquare },
  { label: "Retiros", href: "/retiros", icon: Mountain },
  { label: "Perfil", href: "/perfil", icon: UserCircle },
]

export const adminNavigation = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Usuarios", href: "/admin/usuarios", icon: Users },
  { label: "Clases", href: "/admin/clases", icon: CalendarDays },
  { label: "Reservas", href: "/admin/reservas", icon: Clock },
  { label: "Membresías", href: "/admin/membresias", icon: CreditCard },
  { label: "Funnels", href: "/admin/funnels", icon: Layers },
  { label: "CRM", href: "/admin/crm", icon: Contact },
  { label: "Retiros", href: "/admin/retiros", icon: Mountain },
  { label: "Comunidad", href: "/admin/comunidad", icon: MessageSquare },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Configuración", href: "/admin/configuracion", icon: Settings },
]

export const marketingNavigation = [
  { label: "Inicio", href: "/" },
  { label: "Precios", href: "/precios" },
  { label: "Blog", href: "/blog" },
  { label: "Contacto", href: "/contacto" },
]
