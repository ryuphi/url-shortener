FROM node:14.18.1-slim

WORKDIR /code

COPY package.json package-lock.json ./
RUN npm install