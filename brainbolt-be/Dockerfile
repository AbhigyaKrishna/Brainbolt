# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl python3 make g++

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .
COPY .env.example .env

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Compile seed.ts to dist/prisma
RUN mkdir -p dist/prisma && npx tsc prisma/seed.ts --outDir dist/prisma --module CommonJS --target ES2022 --esModuleInterop --skipLibCheck

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl python3

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy Prisma schema and migrations
COPY prisma ./prisma/
COPY prisma.config.ts ./prisma.config.ts

# Copy built application
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:8000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start command - run migrations, generate client, seed, then start
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/prisma/seed.js || true && node dist/src/index.js"]
