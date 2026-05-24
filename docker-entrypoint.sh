#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy 2>/dev/null || echo "Migration skipped (no migrations folder or DB not ready yet)"

echo "Starting application..."
exec "$@"
