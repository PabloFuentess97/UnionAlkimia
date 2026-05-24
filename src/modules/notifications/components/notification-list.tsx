"use client"

import { useEffect, useState } from "react"
import type { Notification } from "@prisma/client"
import { getNotifications, markAsRead, markAllAsRead } from "../actions/notification-actions"

interface NotificationListProps {
  onClose: () => void
}

export function NotificationList({ onClose }: NotificationListProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNotifications().then((n) => {
      setNotifications(n)
      setLoading(false)
    })
  }, [])

  async function handleMarkRead(id: string) {
    await markAsRead(id)
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readAt: new Date() } : n))
    )
  }

  async function handleMarkAll() {
    await markAllAsRead()
    setNotifications((prev) => prev.map((n) => ({ ...n, readAt: new Date() })))
  }

  if (loading) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        Cargando...
      </div>
    )
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="font-semibold text-sm">Notificaciones</h3>
        <button
          onClick={handleMarkAll}
          className="text-xs text-primary hover:underline"
        >
          Marcar todas leídas
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="p-6 text-center text-sm text-muted-foreground">
          No hay notificaciones
        </div>
      ) : (
        <ul>
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`border-b px-4 py-3 last:border-0 ${
                !n.readAt ? "bg-primary/5" : ""
              }`}
            >
              <button
                onClick={() => {
                  if (!n.readAt) handleMarkRead(n.id)
                  if (n.url) {
                    onClose()
                    window.location.href = n.url
                  }
                }}
                className="w-full text-left"
              >
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {new Date(n.createdAt).toLocaleDateString("es", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
