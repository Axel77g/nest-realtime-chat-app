FROM node:20 AS base

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./
COPY tsconfig.build.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Development target
FROM base AS development
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# Production target
FROM base AS production
EXPOSE 3000
RUN npm run build
CMD ["npm", "run", "start:prod"]