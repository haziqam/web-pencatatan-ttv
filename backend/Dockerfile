FROM node:22-alpine

WORKDIR /usr/src/app

COPY ./package.json ./package-lock.json ./

RUN npm cache clean --force && rm -rf node_modules && npm install

COPY . .

EXPOSE 3000

