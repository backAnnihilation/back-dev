/*
  Warnings:

  - A unique constraint covering the columns `[providerId]` on the table `UserAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('google', 'github');

-- AlterTable
ALTER TABLE "UserAccount" ADD COLUMN     "provider" "Provider",
ADD COLUMN     "providerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount_providerId_key" ON "UserAccount"("providerId");
