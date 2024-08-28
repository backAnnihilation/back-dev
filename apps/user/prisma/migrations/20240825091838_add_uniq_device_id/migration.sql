/*
  Warnings:

  - A unique constraint covering the columns `[deviceId]` on the table `UserSession` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserSession_deviceId_key" ON "UserSession"("deviceId");
