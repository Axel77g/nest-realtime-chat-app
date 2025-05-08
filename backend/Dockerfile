from node:20

# Set the working directory
WORKDIR /app
# Copy package.json and package-lock.json
COPY package*.json ./
# Install dependencies
RUN npm install --legacy-peer-deps

# Expose the application port
EXPOSE 3000
# Start the application
CMD ["npm", "run","start:dev"]