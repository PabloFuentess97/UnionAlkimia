"use client"

import { useCurrentUser } from "@/hooks/use-current-user"
import { Menu } from "lucide-react"

interface AppTopbarProps {
  onMenuClick?: () => void
}

export function AppTopbar({ onMenuClick }: AppTopbarProps) {
  const { user } = useCurrentUser()

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center border-b bg-background px-4 lg:px-6">
      <button
        onClick={onMenuClick}
        className="lg:hidden mr-4 rounded-lg p-2 hover:bg-muted transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.organizationName}</p>
        </div>
        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-sm font-medium text-primary">
            {user?.name?.charAt(0)?.toUpperCase()}
          </span>
        </div>
      </div>
    </header>
  )
}
