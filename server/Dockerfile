FROM node:20

WORKDIR /app

COPY server/package*.json ./

RUN npm install

COPY server .

# Define environment variables
ENV NODE_ENV=production
ENV PORT=5000
ENV WSS_PORT=5001
ENV CORS_ORIGIN=http://localhost:3000
ENV OPENAI_API_KEY=YOUR_OPENAI_KEY
ENV OPENWEATHER_API_KEY=YOUR_OPENWEATHER_KEY
ENV SSL_KEY_PATH=private.pem
ENV SSL_CERT_PATH=public.pem

EXPOSE 5000 5001

CMD ["npm", "run", "start:all"]
