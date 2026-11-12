# syntax=docker/dockerfile:1
# Based on the Payload docs example (docs/production/deployment.mdx), itself from
# https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
# Payload requires Node ^22.23.4 || >=24.22.1, so the base tag is pinned >= 24.22.1.

FROM node:24.22.2-alpine AS base

# ---- deps: install node_modules from the lockfile ----
FROM base AS deps
# libc6-compat: see https://github.com/nodejs/docker-node#nodealpine
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- builder: next build (standalone output) ----
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
# Placeholders so the Payload config loads during `next build`. They exist ONLY in
# this builder stage (never copied to the runner) and are not real credentials.
# The real values are injected at runtime by docker compose.
ARG DATABASE_URL=postgres://build:build@localhost:5432/build
ARG PAYLOAD_SECRET=build-time-placeholder-not-a-secret
RUN DATABASE_URL="$DATABASE_URL" PAYLOAD_SECRET="$PAYLOAD_SECRET" npm run build

# ---- runner: minimal production image ----
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Prerender cache dir and the uploads dir (mounted as the `media` volume).
RUN mkdir .next media \
 && chown nextjs:nodejs .next media

# Output tracing keeps the image small. Migrations (src/migrations) are imported by
# payload.config.ts (`prodMigrations`), so they are bundled into the server output;
# no separate copy is needed.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:3000/api/health || exit 1

# Docker overwrites HOSTNAME at runtime with the container id, so set it inline.
CMD ["sh", "-c", "HOSTNAME=0.0.0.0 exec node server.js"]
