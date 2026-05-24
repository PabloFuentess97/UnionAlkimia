"use client"

import { useEffect, useState } from "react"
import { getUnreadCount } from "../actions/notification-actions"
import { NotificationList } from "./notification-list"

export function NotificationBell() {
  const [count, setCount] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    getUnreadCount().then(setCount)
    const interval = setInterval(() => {
      getUnreadCount().then(setCount)
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-lg p-2 hover:bg-accent"
        aria-label="Notificaciones"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border bg-popover shadow-lg">
            <NotificationList onClose={() => setOpen(false)} />
          </div>
        </>
      )}
    </div>
  )
}
