FROM node:18-alpine
WORKDIR /

COPY package*.json pnpm-lock.yaml* ./
RUN npm i -g pnpm

RUN pnpm install

COPY . .

RUN pnpm run build

CMD pnpm run start