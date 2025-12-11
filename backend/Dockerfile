# ---------- BUILD STAGE ----------
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build


# ---------- PRODUCTION STAGE ----------
FROM node:20-alpine

WORKDIR /app

# Copy only necessary files from build stage
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Expose the backend port
EXPOSE 8000

# Start the backend (run compiled JS file)
CMD ["node", "dist/index.js"]
