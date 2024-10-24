/*
  Warnings:

  - A unique constraint covering the columns `[followerId,followingId]` on the table `Subs` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "UserSession" DROP CONSTRAINT "UserSession_userId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Subs_followerId_followingId_key" ON "Subs"("followerId", "followingId");

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
