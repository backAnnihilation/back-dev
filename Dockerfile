FROM node:20.11-alpine

USER root

RUN npm install -g pnpm

USER node

RUN mkdir -p /home/node/dist/app

WORKDIR /home/node/dist/app

COPY --chown=node package*.json ./ 
COPY --chown=node pnpm-lock.yaml ./

RUN pnpm install

ENV PORT=3508

COPY --chown=node . .

RUN npx prisma generate --schema=./apps/user/prisma/schemas/

RUN npx prisma migrate deploy --schema=./apps/user/prisma/schemas/

RUN pnpm run build

EXPOSE ${PORT}

CMD ["pnpm", "start"]
