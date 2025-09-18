# Ubuntu Health Frontend Dockerfile
# React/Next.js application with Ubuntu philosophy integration

FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set Ubuntu Health environment variables
ENV NEXT_TELEMETRY_DISABLED 1
ENV NEXT_PUBLIC_UBUNTU_PHILOSOPHY "I am because we are"
ENV NEXT_PUBLIC_APP_NAME "Ubuntu Health"
ENV NEXT_PUBLIC_CULTURAL_THEME "ubuntu-healing"

# Build the application with Ubuntu wisdom
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create ubuntu user for security
RUN addgroup --system --gid 1001 ubuntu
RUN adduser --system --uid 1001 ubuntu

# Copy built application
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown ubuntu:ubuntu .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=ubuntu:ubuntu /app/.next/standalone ./
COPY --from=builder --chown=ubuntu:ubuntu /app/.next/static ./.next/static

# Create Ubuntu Health specific directories
RUN mkdir -p /app/ubuntu-wisdom /app/cultural-assets
RUN chown -R ubuntu:ubuntu /app/ubuntu-wisdom /app/cultural-assets

USER ubuntu

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Health check with Ubuntu blessing
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start with Ubuntu blessing
CMD ["node", "server.js"]

# Labels following Ubuntu philosophy
LABEL maintainer="Ubuntu Health Community <community@ubuntu-health.org>"
LABEL version="1.0.0"
LABEL description="Ubuntu Health Frontend - Community-driven healthcare access"
LABEL ubuntu.philosophy="I am because we are"
LABEL ubuntu.component="community-interface"
LABEL ubuntu.healing="digital-bridge"
