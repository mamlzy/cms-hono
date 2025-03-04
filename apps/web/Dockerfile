# src Dockerfile: https://github.com/vercel/turbo/blob/main/examples/with-docker/apps/web/Dockerfile
FROM node:22.12.0-alpine AS alpine

# setup pnpm on the alpine base
FROM alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && npm install -g corepack@latest

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update
RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app
RUN pnpm install turbo --global
COPY . .
RUN turbo prune --scope=web --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# First install the dependencies (as they change less often)

COPY .gitignore .gitignore
COPY --from=builder ./app/out/json/ .
COPY --from=builder ./app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder ./app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

ENV NEXT_TELEMETRY_DISABLED 1

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build the project
COPY --from=builder ./app/out/full/ .
COPY turbo.json turbo.json

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

# Copy the .env.production file into the Docker image
COPY /apps/web/.env.production /app/apps/web/.env.production

RUN pnpm turbo run build --filter=web...

# use alpine as the thinest image
FROM alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV BUILD_STANDALONE true

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer ./app/apps/web/next.config.ts .
COPY --from=installer ./app/apps/web/package.json .

# RUN cat .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs ./app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs ./app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs ./app/apps/web/public ./apps/web/public

ENV NEXT_TELEMETRY_DISABLED 1

CMD node apps/web/server.js