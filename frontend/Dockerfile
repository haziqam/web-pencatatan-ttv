FROM node:22-alpine

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY ./package.json ./

RUN rm -rf node_modules && pnpm install

COPY . .

EXPOSE 5173
