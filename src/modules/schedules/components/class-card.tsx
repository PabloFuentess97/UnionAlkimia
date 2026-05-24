"use client"

import type { ClassSessionWithDetails } from "../types"
import { formatTimeRange } from "../lib/schedule-utils"

interface ClassCardProps {
  session: ClassSessionWithDetails
  showBookButton?: boolean
}

export function ClassCard({ session, showBookButton }: ClassCardProps) {
  const { schedule } = session
  const isCancelled = session.status === "CANCELLED"

  return (
    <div
      className={`rounded-md p-2 text-xs transition-colors ${
        isCancelled
          ? "bg-destructive/10 line-through opacity-60"
          : "bg-muted/50 hover:bg-muted"
      }`}
      style={{
        borderLeft: `3px solid ${schedule.class.color || "#22c55e"}`,
      }}
    >
      <p className="font-medium truncate">{schedule.class.name}</p>
      <p className="text-muted-foreground">
        {formatTimeRange(schedule.startTime, schedule.endTime)}
      </p>
      <p className="text-muted-foreground truncate">
        {schedule.teacher.name}
      </p>
      {showBookButton && !isCancelled && (
        <div className="mt-1 flex items-center justify-between">
          <span className="text-muted-foreground">
            {session.currentCapacity}/{schedule.class.maxCapacity}
          </span>
        </div>
      )}
    </div>
  )
}
