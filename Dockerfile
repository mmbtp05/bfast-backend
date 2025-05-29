FROM node:22-slim

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY .env ./
COPY prisma ./
COPY decent-habitat-448415-n4-7a4ea1f51d05.json ./

RUN npm ci

COPY src ./src

EXPOSE 5000

CMD [ "npm", "run", "dev" ]