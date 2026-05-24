"use client"

import { useState } from "react"
import { SessionProvider } from "@/providers/session-provider"
import { AdminSidebar } from "@/components/layouts/admin-sidebar"
import { AppTopbar } from "@/components/layouts/app-topbar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <SessionProvider>
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar />

        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="absolute left-0 top-0 h-full w-64 bg-sidebar-background"
              onClick={(e) => e.stopPropagation()}
            >
              <AdminSidebar />
            </div>
          </div>
        )}

        <div className="flex flex-1 flex-col overflow-hidden">
          <AppTopbar onMenuClick={() => setMobileMenuOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  )
}
