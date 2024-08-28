# Этап 1: Установка зависимостей
FROM node:20.11-alpine as build-stage
WORKDIR /app
COPY --chown=node package*.json ./
RUN npm install

# Этап 2: Копирование приложения и зависимостей
FROM node:20.11-alpine
WORKDIR /home/node/dist/app
COPY --from=build-stage /app/node_modules ./node_modules
COPY --chown=node . .

# Генерация Prisma клиента
RUN npx prisma generate --schema=./apps/user/prisma/schema.prisma

# Сборка приложения
RUN npm run build

# Настройка переменных окружения и порта
ENV PORT=3498
EXPOSE ${PORT}
ENV ENV='TESTING'
ENV GOOGLE_CAPTURE_SECRET=6LcXfikqAAAAAAsHDkBJ1frq_DBvqq7jKtgOObJA
ENV CAPTURE_SITE_KEY=6LcXfikqAAAAAEtJf27WMmB70tR2xlm2A3Jlgz6P
ENV DATABASE_URL_FOR_TESTS="postgresql://userdb:qwerty123@localhost:5433/postgresdb?schema=public"
ENV DATABASE_URL="postgres://avnadmin:AVNS_C_w6bSq7j6bueOavIug@pg-ebf4a9a-commonbackmail-5fad.f.aivencloud.com:11550/defaultdb?sslmode=require"
ENV ACCESS_TOKEN_SECRET=ACCESS_TOKEN_SECRET_KEY
ENV REFRESH_TOKEN_SECRET=jwt_refresh_secret_KEY
ENV DATABASE_LOCAL_URL="postgresql://userdb:qwerty123@localhost:5433/postgresdb?schema=public"
ENV POSTGRES_USER=userdb
ENV POSTGRES_PASSWORD=qwerty123
ENV POSTGRES_PORT=5433
ENV DATABASE_NAME=postgresdb
ENV EMAIL_PASSWORD="jhnt xkje pyxx cldg"
ENV EMAIL_USER=kr4mboy@gmail.com
ENV EMAIL_SERVICE=gmail
ENV BASIC_AUTH_USERNAME=admin
ENV BASIC_AUTH_PASSWORD=qwerty

# Запуск приложения с применением миграций Prisma
CMD ["sh", "-c", "npx prisma migrate deploy --schema=./apps/user/prisma/schema.prisma && npm start"]
