FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json .

RUN npm ci
COPY . .
COPY .env .env

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

RUN npm run build
RUN npm prune --production

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/healthz || exit 1

CMD [ "node", "build" ]
