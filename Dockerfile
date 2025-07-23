# Use an official Node image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install Prisma client early to cache better
COPY prisma ./prisma
COPY package*.json ./
RUN npm install
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Build the NestJS project
RUN npm run build

# Expose the NestJS port
EXPOSE 3000

# Start the app in production mode
CMD ["npm", "run", "start:prod"]
