FROM node:24.13.0-bookworm AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
 
COPY package*json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN npm run build
RUN npm run migrate:build

FROM base AS installer
WORKDIR /app
 
COPY package*json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
ENV NODE_ENV=production
RUN pnpm install --frozen-lockfile --prod

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=installer --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/migrations ./migrations
COPY --from=builder --chown=nestjs:nodejs /app/dist ./

USER nestjs

ENV PORT=8080
EXPOSE ${PORT}

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT}/docs || exit 1

CMD ["sh", "-c", "node ./migrate.mjs && node ./main.js"]