FROM node:22-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .

RUN npm run generate-sitemap

RUN npm run build

RUN npm install -g serve

COPY .env .env

EXPOSE 3000

# CMD ["serve", "-s", "build", "-l", "3000", "--ssl-cert", "/etc/ssl/certs/localhost.pem", "--ssl-key", "/etc/ssl/private/localhost-key.pem"]
CMD ["serve", "-s", "build", "-l", "3000"]