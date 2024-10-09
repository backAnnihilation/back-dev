-- AlterTable
ALTER TABLE "UserProfile" ALTER COLUMN "birthDate" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Subs" (
    "id" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subs_pkey" PRIMARY KEY ("id")
);
