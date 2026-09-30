# -----------------------------
# 1. Dependencias
# -----------------------------
FROM node:24-bookworm-slim AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci


# -----------------------------
# 2. Build
# -----------------------------
FROM node:24-bookworm-slim AS builder

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# Prisma necesita que DATABASE_URL exista
# durante la generación/build, pero no necesita
# ser la credencial real de producción.
ENV DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build"

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npm run build


# -----------------------------
# 3. Runtime
# -----------------------------
FROM node:24-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node

EXPOSE 3000

CMD ["node", "server.js"]
