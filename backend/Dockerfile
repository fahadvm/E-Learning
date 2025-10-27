# Use Node.js official image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the files
COPY . .

# If using TypeScript, build it (remove if JS only)
RUN npm run build || echo "No build script, skipping"

# Expose the backend port (change if needed)
EXPOSE 8000

# Start the backend
CMD ["npm", "start"]
