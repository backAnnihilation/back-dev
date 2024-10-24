-- CreateEnum
CREATE TYPE "ImageStatus" AS ENUM ('pending', 'failed', 'success');

-- AlterTable
ALTER TABLE "UserProfile" ALTER COLUMN "birthDate" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ProfileImage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ImageStatus" NOT NULL DEFAULT 'pending',
    "imageMetaId" TEXT,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "ProfileImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfileImage_imageMetaId_key" ON "ProfileImage"("imageMetaId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileImage_profileId_key" ON "ProfileImage"("profileId");

-- AddForeignKey
ALTER TABLE "ProfileImage" ADD CONSTRAINT "ProfileImage_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
