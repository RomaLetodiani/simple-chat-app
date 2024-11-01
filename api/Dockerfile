FROM --platform=linux/amd64 node:20-alpine AS builder

WORKDIR /app

COPY . .


COPY package*.json .

RUN npm install
RUN npm run build

FROM --platform=linux/amd64 node:20-alpine AS runner

WORKDIR /app
COPY --from=builder /app/dist .

EXPOSE 3030

CMD ["node", "server.js"]
