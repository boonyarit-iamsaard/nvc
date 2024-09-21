#
# Base
#
FROM node:20.17-alpine3.20 AS alpine

RUN apk update \
  && apk add --no-cache libc6-compat

#
# Base for pnpm and turbo setup
#
FROM alpine AS base

RUN npm install pnpm@^9.11.0 turbo@^2.1.2 --global

#
# Prune dependencies
#
FROM base AS pruner

WORKDIR /app

COPY . .

RUN turbo prune --scope=server --docker

#
# Install all dependencies
#
FROM base AS deps

WORKDIR /app

COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .

RUN pnpm install --frozen-lockfile

#
# Production dependencies
#
FROM base AS prod-deps

WORKDIR /app

COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .

RUN pnpm install --frozen-lockfile --prod

#
# Build the server package
#
FROM deps AS build

WORKDIR /app

COPY --from=pruner /app/out/full/ .

RUN turbo build --filter=server

#
# Final production-ready image
#
FROM alpine AS release

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nodejs
USER nodejs

WORKDIR /app

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/apps/server/node_modules ./apps/server/node_modules
# The `package.json` file is required in the final image to enable ES module
# support with the `"type": "module"` field. This ensures Node.js correctly
# interprets `import` and `export` syntax in `.js` files.
COPY --from=prod-deps /app/apps/server/package.json ./apps/server/package.json
COPY --from=build /app/apps/server/dist ./apps/server/dist

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

CMD ["node", "apps/server/dist/main.js"]
