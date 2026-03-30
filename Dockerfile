FROM node:20-alpine

WORKDIR /app

COPY Backend-ALM/package*.json ./Backend-ALM/
WORKDIR /app/Backend-ALM
RUN npm ci --omit=dev

WORKDIR /app
COPY Backend-ALM ./Backend-ALM
COPY Frontend-ALM ./Frontend-ALM

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "Backend-ALM/src/server.js"]
