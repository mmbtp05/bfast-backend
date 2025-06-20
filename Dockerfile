FROM node:22-slim

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY .env ./
COPY prisma ./
COPY schema.zmodel ./

RUN apt-get update -y  
RUN apt-get install -y openssl

RUN npm ci

COPY src ./src

EXPOSE 5000

CMD [ "npm", "start" ]