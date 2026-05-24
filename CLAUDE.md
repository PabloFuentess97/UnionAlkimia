# Union Alkimia

Plataforma SaaS multi-tenant para gestión de estudios de yoga y wellness. Next.js 15 + TypeScript + PostgreSQL + Prisma.

## Comandos

- `pnpm dev` — Servidor de desarrollo (requiere Docker containers activos)
- `pnpm build` — Build de producción
- `pnpm lint` — ESLint
- `pnpm db:migrate` — Crear/aplicar migraciones
- `pnpm db:generate` — Regenerar cliente Prisma
- `pnpm db:studio` — UI visual de la base de datos
- `pnpm db:seed` — Ejecutar seed
- `docker compose -f docker-compose.dev.yml up -d` — Levantar PostgreSQL + Redis + MinIO

## Stack

Next.js 15 (App Router) + TypeScript (strict) + TailwindCSS v4 + shadcn/ui + PostgreSQL 16 + Prisma 7 + Auth.js v5 + Stripe + PayPal + Resend + MinIO + Redis + Docker + Coolify

## Arquitectura

### Estructura
- `src/app/` — Páginas y layouts (App Router route groups)
- `src/modules/` — Módulos de dominio (auth, bookings, schedules, memberships, payments, community, retreats, crm, funnels, notifications, analytics)
- `src/components/` — UI compartida (ui/, shared/, layouts/, forms/)
- `src/lib/` — Clientes y utilidades (db, auth, stripe, minio, redis, resend)
- `src/hooks/` — Custom hooks
- `src/providers/` — Context providers
- `src/types/` — Tipos TypeScript
- `src/config/` — Configuración (navigation, plans, site metadata)
- `src/emails/` — Templates React Email
- `prisma/` — Schema, migraciones, seed

### Multi-Tenant
- TODOS los recursos tienen `organizationId`
- Prisma client extension filtra automáticamente por org activa
- Middleware extrae org del usuario autenticado
- NUNCA hacer queries sin pasar por el client extendido

### Data Flow
- Server Components → Prisma queries directas (sin API)
- Mutations → Server Actions con validación Zod
- Client state → TanStack Query (polling) + Zustand (UI)
- Forms → React Hook Form + Zod resolver

### Patrones Clave
- Server Components por defecto. Solo "use client" cuando hay interactividad
- Server Actions para TODAS las mutations (no API routes)
- API routes SOLO para webhooks y endpoints externos
- Validación Zod en TODOS los inputs (client y server)
- Error handling: ActionResult<T> = { success: true, data } | { success: false, error }

## Reglas de Código

1. Un componente por archivo. Máximo 300 líneas.
2. Path alias: Usar `@/` para imports desde `src/`.
3. No barrel exports. Importar directamente desde el archivo fuente.
4. Server Components por defecto. Solo "use client" cuando necesario.
5. Cada módulo es independiente. No importar entre módulos excepto tipos.
6. Naming: archivos kebab-case, componentes PascalCase, funciones camelCase.
7. Mobile-first: Todo diseño empieza mobile y escala con breakpoints.
8. Nunca `any`. TypeScript strict mode.
9. ActionResult<T> para toda mutation.
10. Nunca commitear `.env` — solo `.env.example`.
