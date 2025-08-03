FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client (needed for TypeScript compilation)
RUN npx prisma generate

# Build the application
RUN npm run build:app

# List the contents to debug
RUN ls -la dist/

# Expose port
EXPOSE 3000

# Run Prisma commands and start the app at runtime
CMD ["sh", "-c", "npx prisma db push && node dist/src/main.js"]