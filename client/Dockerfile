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

# Install serve
RUN npm install -g serve

# Set the environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV REACT_APP_SERVER_URL=https://devablos-v2-api.azurewebsites.net
ENV REACT_APP_WS_URL=wss://devablos-v2-api.azurewebsites.net/ws
ENV HTTPS=true

# Expose the port the app runs on
EXPOSE 3000


# Run the app
CMD ["npx", "serve", "-s", "build"]
