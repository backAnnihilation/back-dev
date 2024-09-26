FROM node:18

USER node

WORKDIR /usr/src/app

COPY pnpm-lock.yaml ./
COPY package.json ./

RUN npm install -g pnpm

RUN pnpm i --frozen-lockfile

COPY . .

RUN pnpm run build

CMD ["pnpm", "start"]

EXPOSE 8765
