# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy source and prisma configuration
COPY . .

# Generate Prisma Client
RUN yarn prisma generate

# Build the app
RUN yarn build

# Final stage
FROM node:20-alpine

WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# Use dist/src/main as Nest often nests the output under src/ when prisma is parallel
CMD ["node", "dist/src/main"]
