FROM node:22-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

COPY .env .env

EXPOSE 5000

CMD ["npm", "start"]
