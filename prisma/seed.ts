import { PrismaClient } from "@prisma/client"
import { hashSync } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const org = await prisma.organization.upsert({
    where: { slug: "union-alkimia" },
    update: {},
    create: {
      name: "Union Alkimia",
      slug: "union-alkimia",
      email: "info@unionalkimia.com",
      phone: "+34 600 000 000",
      address: "Calle del Yoga 1, Madrid",
      timezone: "Europe/Madrid",
      plan: "PRO",
      settings: {
        cancellationPolicy: 2,
        maxBookingsPerDay: 3,
        waitlistEnabled: true,
      },
    },
  })

  const admin = await prisma.user.upsert({
    where: { email: "admin@unionalkimia.com" },
    update: {},
    create: {
      email: "admin@unionalkimia.com",
      name: "Admin Union Alkimia",
      hashedPassword: hashSync("Admin123!", 12),
      emailVerified: new Date(),
    },
  })

  await prisma.organizationMember.upsert({
    where: { userId_organizationId: { userId: admin.id, organizationId: org.id } },
    update: {},
    create: {
      userId: admin.id,
      organizationId: org.id,
      role: "ORG_ADMIN",
    },
  })

  const teacher = await prisma.user.upsert({
    where: { email: "profe@unionalkimia.com" },
    update: {},
    create: {
      email: "profe@unionalkimia.com",
      name: "María García",
      hashedPassword: hashSync("Profe123!", 12),
      emailVerified: new Date(),
    },
  })

  await prisma.organizationMember.upsert({
    where: { userId_organizationId: { userId: teacher.id, organizationId: org.id } },
    update: {},
    create: {
      userId: teacher.id,
      organizationId: org.id,
      role: "TEACHER",
    },
  })

  const room = await prisma.room.create({
    data: {
      organizationId: org.id,
      name: "Sala Principal",
      capacity: 20,
    },
  })

  const classes = await Promise.all([
    prisma.class.create({
      data: {
        organizationId: org.id,
        name: "Hatha Yoga",
        description: "Clase tradicional de Hatha Yoga para todos los niveles",
        duration: 60,
        maxCapacity: 15,
        color: "#22c55e",
      },
    }),
    prisma.class.create({
      data: {
        organizationId: org.id,
        name: "Vinyasa Flow",
        description: "Clase dinámica con transiciones fluidas entre posturas",
        duration: 75,
        maxCapacity: 12,
        color: "#3b82f6",
      },
    }),
    prisma.class.create({
      data: {
        organizationId: org.id,
        name: "Yin Yoga",
        description: "Práctica suave y profunda con posturas mantenidas",
        duration: 90,
        maxCapacity: 18,
        color: "#8b5cf6",
      },
    }),
    prisma.class.create({
      data: {
        organizationId: org.id,
        name: "Meditación",
        description: "Sesión guiada de meditación y mindfulness",
        duration: 30,
        maxCapacity: 20,
        color: "#f59e0b",
        isOnline: true,
      },
    }),
  ])

  await prisma.membershipPlan.create({
    data: {
      organizationId: org.id,
      name: "Plan Ilimitado",
      description: "Acceso ilimitado a todas las clases presenciales y online",
      price: 7900,
      currency: "EUR",
      interval: "MONTHLY",
      features: ["Clases ilimitadas", "Acceso comunidad", "Descuentos en retiros"],
      sortOrder: 1,
    },
  })

  await prisma.membershipPlan.create({
    data: {
      organizationId: org.id,
      name: "Plan 8 Clases",
      description: "8 clases al mes para una práctica regular",
      price: 5900,
      currency: "EUR",
      interval: "MONTHLY",
      classesPerMonth: 8,
      features: ["8 clases/mes", "Acceso comunidad"],
      sortOrder: 2,
    },
  })

  console.log("Seed completado:")
  console.log(`  - Organización: ${org.name} (${org.slug})`)
  console.log(`  - Admin: ${admin.email}`)
  console.log(`  - Profesora: ${teacher.email}`)
  console.log(`  - Sala: ${room.name}`)
  console.log(`  - Clases: ${classes.map((c) => c.name).join(", ")}`)
  console.log(`  - Planes de membresía creados`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
