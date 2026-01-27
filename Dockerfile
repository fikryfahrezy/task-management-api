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

FROM base AS installer
WORKDIR /app
 
COPY package*json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
ENV NODE_ENV=production
RUN pnpm install --frozen-lockfile --prod

FROM base AS migrator
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY package*json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY ./tsconfig.json ./
COPY ./migrate.mjs ./
COPY ./migrations/ ./migrations/

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=installer --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

USER nestjs

ENV PORT=8080
EXPOSE ${PORT}

CMD ["node", "dist/main"]