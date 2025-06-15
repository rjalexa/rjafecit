# Stage 1: Build the application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy the rest of the application
COPY . .

# Create data directory and copy JSON file
RUN mkdir -p data
COPY data/smorfia_napoletana.json ./data/

# Generate migrations and run database setup
RUN pnpm db:generate
RUN pnpm db:migrate
RUN pnpm db:seed

# Build the Next.js application
RUN pnpm build

# Stage 2: Production image
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Install pnpm, as it's not in the base image
RUN npm install -g pnpm

# Copy built assets from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/data ./data
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/drizzle ./drizzle

# Expose the port the app runs on
EXPOSE 3000

# By default, the node alpine image has an entrypoint of "node".
# This causes the CMD to be passed as an argument to node.
# We reset the entrypoint to execute the CMD directly.
ENTRYPOINT []

# Start the application in production mode
CMD ["pnpm", "start"]
