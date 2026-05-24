import { getClasses } from "@/modules/schedules/actions/class-actions"
import { getRooms } from "@/modules/schedules/actions/room-actions"
import { AdminClassesClient } from "./client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Gestión de Clases",
}

export default async function AdminClasesPage() {
  const [classes, rooms] = await Promise.all([getClasses(), getRooms()])

  return <AdminClassesClient initialClasses={classes} initialRooms={rooms} />
}
