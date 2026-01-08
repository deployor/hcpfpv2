## ---------- Builder stage ----------
FROM node:20-slim AS builder

ENV NODE_ENV=production
WORKDIR /app

# Install dependencies first for better caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy source files
COPY . .

# Include environment files during build
# (These will be used by Next at build time for embedding env)
# If you have different env files, ensure they exist in the context
COPY .env* ./

# Disable Next telemetry and build
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

## ---------- Runtime stage ----------
FROM node:20-slim AS runner

ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /app

# Copy the standalone output and static assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# If you need runtime env, pass them via `--env-file` when running the container.
EXPOSE 3000
CMD ["node", "server.js"]
