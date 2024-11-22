FROM --platform=linux/amd64 node:20-alpine AS base

FROM base AS builder

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build

FROM base AS runner

WORKDIR /app
COPY --from=builder /app/dist .

EXPOSE 3030

CMD ["node", "server.js"]
