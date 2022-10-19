FROM node:14-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY tsconfig*.json ./
COPY src src
RUN npm run build:prod

FROM node:14-alpine
ENV NODE_ENV=prod
RUN apk add --no-cache tini
WORKDIR /usr/src/app
RUN chown node:node .
USER node
COPY package*.json ./
RUN npm install
COPY --from=builder /usr/src/app/dist/src ./
EXPOSE 3000
ENTRYPOINT [ "/sbin/tini","--", "node", "apps/url/start.js"]
