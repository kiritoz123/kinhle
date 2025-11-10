FROM node:18-alpine AS builder

WORKDIR /app

# Accept build argument for API URL
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY public ./public
COPY src ./src

# Build the application
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
