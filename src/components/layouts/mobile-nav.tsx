"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarDays, Home, MessageSquare, Clock, UserCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const mobileItems = [
  { label: "Inicio", href: "/dashboard", icon: Home },
  { label: "Horarios", href: "/horarios", icon: Clock },
  { label: "Reservas", href: "/reservas", icon: CalendarDays },
  { label: "Comunidad", href: "/comunidad", icon: MessageSquare },
  { label: "Perfil", href: "/perfil", icon: UserCircle },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t bg-background">
      <div className="flex items-center justify-around py-2">
        {mobileItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1 text-xs transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
