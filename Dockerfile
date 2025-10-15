# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files for frontend
COPY package*.json ./

# Install dependencies (ignore postinstall script since server folder doesn't exist yet)
RUN npm ci --ignore-scripts

# Copy source files
COPY . .

# Build the frontend application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy server package files
COPY server/package*.json ./server/

# Install production dependencies only
WORKDIR /app/server
RUN npm ci --only=production

# Copy server source code
COPY server/ ./

# Copy built frontend from build stage
COPY --from=build /app/dist /app/dist

# Set working directory back to /app
WORKDIR /app

# Expose port (default 3001, can be overridden with PORT env var)
EXPOSE 3001

# Set environment variable defaults
ENV NODE_ENV=production
ENV PORT=3001

# Start the server
CMD ["node", "server/index.js"]

