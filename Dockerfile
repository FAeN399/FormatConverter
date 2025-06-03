# Use Node.js for building and serving
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the project files
COPY . .

# Run linters and tests (optional for production, included for completeness)
RUN npm run lint && npm run test

# Install a simple static server
RUN npm install -g serve

# Expose port 80 and set the default command to serve the web app
EXPOSE 80
CMD ["serve", "-s", "src/web", "-l", "80"]
