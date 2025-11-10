FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy application code
COPY src ./src

# Expose port
EXPOSE 4000

# Start the application
CMD ["npm", "start"]
