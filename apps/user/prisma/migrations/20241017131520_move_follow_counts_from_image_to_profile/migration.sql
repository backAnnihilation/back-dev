/*
  Warnings:

  - You are about to drop the column `followerCount` on the `ProfileImage` table. All the data in the column will be lost.
  - You are about to drop the column `followingCount` on the `ProfileImage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProfileImage" DROP COLUMN "followerCount",
DROP COLUMN "followingCount";

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "followerCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "followingCount" INTEGER NOT NULL DEFAULT 0;
