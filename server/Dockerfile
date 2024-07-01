FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

COPY .env .env

EXPOSE 5001 5002

CMD ["npm", "run", "start:all"]
