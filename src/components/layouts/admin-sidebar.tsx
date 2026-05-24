"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { adminNavigation } from "@/config/navigation"
import { cn } from "@/lib/utils"
import { LogOut, ArrowLeft } from "lucide-react"
import { signOut } from "next-auth/react"

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r bg-sidebar-background">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin/dashboard" className="text-lg font-bold text-primary">
          Admin Panel
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {adminNavigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-3 space-y-1">
        <Link
          href="/dashboard"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a la app
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
