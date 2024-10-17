-- DropForeignKey
ALTER TABLE "UserSession" DROP CONSTRAINT "UserSession_userId_fkey";

-- AlterTable
ALTER TABLE "UserAccount" ALTER COLUMN "passwordHash" DROP NOT NULL,
ALTER COLUMN "confirmationCode" DROP NOT NULL,
ALTER COLUMN "confirmationExpDate" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
