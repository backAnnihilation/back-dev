-- CreateEnum
CREATE TYPE "SubStatus" AS ENUM ('active', 'inactive', 'blocked');

-- AlterTable
ALTER TABLE "ProfileImage" ADD COLUMN     "followerCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "followingCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Subs" ADD COLUMN     "status" "SubStatus" NOT NULL DEFAULT 'active';
