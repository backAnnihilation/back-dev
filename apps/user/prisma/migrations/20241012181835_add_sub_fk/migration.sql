/*
  Warnings:

  - Added the required column `updatedAt` to the `Subs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subs" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Subs" ADD CONSTRAINT "Subs_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "UserAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subs" ADD CONSTRAINT "Subs_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "UserAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
