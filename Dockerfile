FROM node:18
WORKDIR /

COPY package.json pnpm-lock.yaml* ./
RUN npm i -g pnpm && pnpm i

COPY . .

RUN pnpm run build

CMD pnpm run start