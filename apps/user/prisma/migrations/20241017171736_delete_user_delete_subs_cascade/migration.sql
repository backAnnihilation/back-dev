-- DropForeignKey
ALTER TABLE "Subs" DROP CONSTRAINT "Subs_followerId_fkey";

-- DropForeignKey
ALTER TABLE "Subs" DROP CONSTRAINT "Subs_followingId_fkey";

-- AddForeignKey
ALTER TABLE "Subs" ADD CONSTRAINT "Subs_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "UserAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subs" ADD CONSTRAINT "Subs_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "UserAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
