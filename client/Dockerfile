# Use the official Node.js 20 image.
FROM node:20

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install production dependencies.
RUN npm install --production

# Copy application code to the container image.
COPY . .

# Build the React app
RUN npm run build

# Set the environment variables
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 3000

# Run the app
CMD ["npx", "serve", "-s", "build"]
