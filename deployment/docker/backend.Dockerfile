# Ubuntu Health Backend Dockerfile
# Node.js/Express API with Ubuntu community consensus middleware

FROM node:18-alpine AS base

# Install system dependencies for Ubuntu Health services
RUN apk add --no-cache \
    libc6-compat \
    curl \
    bash \
    postgresql-client \
    redis-tools

# Set Ubuntu Health working directory
WORKDIR /app

# Create ubuntu user for security and community principles
RUN addgroup --system --gid 1001 ubuntu && \
    adduser --system --uid 1001 --ingroup ubuntu ubuntu

# Install dependencies
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Development dependencies for building
FROM base AS builder
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --production

# Production stage
FROM base AS runner
WORKDIR /app

# Copy built application and dependencies
COPY --from=builder --chown=ubuntu:ubuntu /app/dist ./dist
COPY --from=builder --chown=ubuntu:ubuntu /app/node_modules ./node_modules
COPY --from=builder --chown=ubuntu:ubuntu /app/package.json ./package.json

# Create Ubuntu Health specific directories
RUN mkdir -p \
    /app/logs \
    /app/cultural-data \
    /app/ubuntu-wisdom \
    /app/community-consensus \
    /app/traditional-healing \
    /app/recovery-logs && \
    chown -R ubuntu:ubuntu /app

# Copy configuration files
COPY --chown=ubuntu:ubuntu config/ ./config/
COPY --chown=ubuntu:ubuntu scripts/ ./scripts/

# Set environment for Ubuntu Health
ENV NODE_ENV=production
ENV UBUNTU_PHILOSOPHY="I am because we are"
ENV COMMUNITY_FIRST=true
ENV ELDER_WISDOM_ENABLED=true
ENV TRADITIONAL_HEALING_SUPPORT=true

# Switch to ubuntu user
USER ubuntu

# Expose ports for API and Socket.IO
EXPOSE 5000 8080

# Health check with Ubuntu community validation
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:5000/api/health/ubuntu-community || exit 1

# Volume for persistent Ubuntu community data
VOLUME ["/app/logs", "/app/cultural-data", "/app/ubuntu-wisdom"]

# Start Ubuntu Health backend with community blessing
CMD ["node", "dist/server.js"]

# Ubuntu Health labels
LABEL maintainer="Ubuntu Health Community <community@ubuntu-health.org>"
LABEL version="1.0.0"
LABEL description="Ubuntu Health Backend - Community consensus API"
LABEL ubuntu.philosophy="I am because we are"
LABEL ubuntu.component="community-consensus"
LABEL ubuntu.healing="digital-medicine"
LABEL ubuntu.wisdom="elder-guidance"
