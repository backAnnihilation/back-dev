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
COPY --chown=node apps/${SERVICE} .

# Verify that prisma schema exists
RUN ls -la .

# Generate prisma client
RUN npx prisma generate --schema=./prisma/schemas/

# Deploy migrations
RUN npx prisma migrate deploy --schema=./prisma/schemas/

RUN pnpm run build:${SERVICE}

EXPOSE ${PORT}

CMD pnpm 'start:user'
