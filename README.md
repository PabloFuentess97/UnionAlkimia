# Union Alkimia

Plataforma SaaS multi-tenant para gestion de estudios de yoga y wellness.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict)
- **Database:** PostgreSQL 16 + Prisma 7
- **Auth:** Auth.js v5 (NextAuth)
- **Payments:** Stripe
- **Cache:** Redis 7
- **Storage:** MinIO (S3-compatible)
- **Email:** Resend + React Email
- **Testing:** Vitest + Playwright

## Desarrollo Local

```bash
# 1. Levantar servicios
docker compose up -d

# 2. Configurar variables
cp .env.example .env.local

# 3. Instalar dependencias
pnpm install

# 4. Crear tablas
pnpm db:push

# 5. Seed inicial
pnpm db:seed

# 6. Iniciar dev server
pnpm dev
```

## Deploy en Coolify

### Opcion 1: Docker Compose (recomendado)

1. En Coolify, crear nuevo recurso > **Docker Compose**
2. Conectar el repositorio Git: `https://github.com/PabloFuentess97/UnionAlkimia.git`
3. Seleccionar archivo: `docker-compose.prod.yml`
4. Configurar las variables de entorno en Coolify (ver seccion abajo)
5. Deploy

### Opcion 2: Dockerfile (solo la app)

Si ya tienes PostgreSQL, Redis y MinIO en Coolify como servicios separados:

1. Crear nuevo recurso > **Dockerfile**
2. Conectar el repositorio Git
3. Configurar variables de entorno apuntando a tus servicios existentes
4. Health check path: `/api/health`
5. Puerto: `3000`
6. Deploy

### Variables de Entorno (Coolify)

```env
# === REQUERIDAS ===
DATABASE_URL=postgresql://postgres:TU_PASSWORD@postgres:5432/union_alkimia
REDIS_URL=redis://redis:6379
NEXTAUTH_URL=https://tu-dominio.com
NEXTAUTH_SECRET=genera-con-openssl-rand-base64-32

# === STRIPE ===
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# === EMAIL ===
RESEND_API_KEY=re_...
FROM_EMAIL=Union Alkimia <noreply@tu-dominio.com>

# === STORAGE ===
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=tu-access-key
MINIO_SECRET_KEY=tu-secret-key
MINIO_BUCKET=union-alkimia

# === PWA / PUSH ===
NEXT_PUBLIC_VAPID_PUBLIC_KEY=genera-con-web-push-generate-vapid-keys
VAPID_PRIVATE_KEY=genera-con-web-push-generate-vapid-keys
VAPID_EMAIL=admin@tu-dominio.com

# === CRON ===
CRON_SECRET=un-token-secreto-para-cron-jobs

# === DATABASE (para docker-compose) ===
POSTGRES_DB=union_alkimia
POSTGRES_USER=postgres
POSTGRES_PASSWORD=una-password-segura
```

### Post-Deploy

1. Configurar dominio y SSL en Coolify (automatico con Let's Encrypt)
2. Crear webhook en Stripe apuntando a `https://tu-dominio.com/api/webhooks/stripe`
3. Configurar dominio en Resend para deliverability
4. Generar claves VAPID: `npx web-push generate-vapid-keys`

## Scripts

| Comando | Descripcion |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Build de produccion |
| `pnpm test` | Tests unitarios (watch) |
| `pnpm test:run` | Tests unitarios (CI) |
| `pnpm test:e2e` | Tests E2E con Playwright |
| `pnpm db:push` | Sincronizar schema con DB |
| `pnpm db:seed` | Cargar datos iniciales |
| `pnpm db:studio` | Abrir Prisma Studio |
