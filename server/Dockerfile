FROM node:22-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

COPY .env .env

EXPOSE 5001 5002

CMD ["npm", "run", "start:pain"]
