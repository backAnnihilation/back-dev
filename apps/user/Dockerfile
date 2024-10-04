FROM node:20.11-alpine
ARG port
ARG service
ENV SERVICE=$service
ENV PORT=$port

USER root

RUN npm install -g pnpm

USER node

RUN mkdir -p /home/node/dist/${SERVICE}

WORKDIR /home/node/dist/${SERVICE}


COPY --chown=node package*.json ./
COPY --chown=node pnpm-lock.yaml ./

RUN pnpm install

# Bundle app source code
COPY --chown=node . .


RUN npx prisma generate --schema=./prisma/schemas/

RUN npx prisma migrate deploy --schema=./prisma/schemas/

# RUN pnpm run build

RUN pnpm run build:${SERVICE}

# Bind to all network interfaces so that it can be mapped to the host OS

EXPOSE ${PORT}

CMD pnpm 'start:user'
