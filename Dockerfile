
FROM node:lts-alpine

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --production --silent

# Copy application code
COPY . .

# Build-time environment variables will be replaced by runtime variables
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_KEY
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_KEY=${VITE_SUPABASE_KEY}

# Build the Vite application
RUN npm run build

# Expose the application port
EXPOSE 3000

# Set permissions for the node user
RUN chown -R node:node /usr/src/app

# Switch to non-root user
USER node

# Start the application
CMD ["npm", "run", "preview"]
