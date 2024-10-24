/*
  Warnings:

  - A unique constraint covering the columns `[imageId]` on the table `UserPost` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `imageId` to the `UserPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserPost" ADD COLUMN     "imageId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserPost_imageId_key" ON "UserPost"("imageId");
