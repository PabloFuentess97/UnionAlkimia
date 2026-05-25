FROM node:20-alpine AS builder
RUN npm install -g pnpm@10
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma/
RUN pnpm install --frozen-lockfile

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV NEXTAUTH_URL="http://localhost:3000"
ENV NEXTAUTH_SECRET="build-time-secret-not-used-in-runtime"
ENV REDIS_URL="redis://localhost:6379"
ENV STRIPE_SECRET_KEY="sk_test_placeholder_for_build"
ENV RESEND_API_KEY="re_placeholder_for_build"
ENV NEXT_PUBLIC_VAPID_PUBLIC_KEY="placeholder"
ENV VAPID_PRIVATE_KEY="placeholder"

RUN pnpm prisma generate
RUN pnpm exec next build

FROM node:20-alpine AS runner
RUN npm install -g pnpm@10
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

USER nextjs
EXPOSE 3000
ENV PORT=3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["pnpm", "start"]
