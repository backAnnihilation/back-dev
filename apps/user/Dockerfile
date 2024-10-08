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

# Verify user structure after dir being copied
RUN ls -la ./apps/user

# Generate prisma client
RUN npx prisma generate --schema=./apps/user/prisma/schemas/

# Deploy migrations
RUN npx prisma migrate deploy --schema=./apps/user/prisma/schemas/

RUN pnpm run build:${SERVICE}

EXPOSE ${PORT}

CMD pnpm 'start:user'
