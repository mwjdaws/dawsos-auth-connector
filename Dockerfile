
FROM node:lts-alpine

# Set environment variables
ENV NODE_ENV=production
ENV VITE_SUPABASE_URL=https://inclticnisqmlnkolwlu.supabase.co
ENV VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluY2x0aWNuaXNxbWxua29sd2x1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MDE3MTUsImV4cCI6MjA1ODQ3NzcxNX0.z5AF_lORtEU0hmXr8oe-x4ldbe249e4sPgY6BJqv4XY

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --production --silent

# Copy application code
COPY . .

# Build the Vite application
RUN npm run build

# Ensure unnecessary files are excluded using .dockerignore

# Expose the application port
EXPOSE 3000

# Set permissions for the node user
RUN chown -R node:node /usr/src/app

# Switch to non-root user
USER node

# Add a health check (optional)
# HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
#     CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["npm", "run", "preview"]
