FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .

RUN npm run build

RUN npm install -g serve

COPY .env .env

EXPOSE 3000


CMD ["npx", "serve", "-s", "build"]
