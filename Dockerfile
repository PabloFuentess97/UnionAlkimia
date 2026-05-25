FROM node:20-alpine
RUN npm install -g pnpm@10
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma/
RUN pnpm install --frozen-lockfile

# Copy source and build
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

# Runtime config
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=90s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["./node_modules/.bin/next", "start", "-H", "0.0.0.0", "-p", "3000"]
