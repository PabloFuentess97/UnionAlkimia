import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin - Usuarios",
}

export default async function AdminUsuariosPage() {
  const session = await auth()
  if (!session?.user?.organizationId) return null

  const members = await prisma.organizationMember.findMany({
    where: { organizationId: session.user.organizationId },
    include: { user: { select: { id: true, name: true, email: true, avatar: true, createdAt: true } } },
    orderBy: { joinedAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <p className="text-muted-foreground">{members.length} miembros</p>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Nombre</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Rol</th>
              <th className="px-4 py-3 text-left font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{member.user.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{member.user.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    member.role === "ORG_ADMIN" ? "bg-purple-100 text-purple-700" :
                    member.role === "TEACHER" ? "bg-blue-100 text-blue-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {member.role === "ORG_ADMIN" ? "Admin" :
                     member.role === "TEACHER" ? "Profesor" : "Alumno"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    member.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {member.isActive ? "Activo" : "Inactivo"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
