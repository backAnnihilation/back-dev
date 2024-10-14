/*
  Warnings:

  - A unique constraint covering the columns `[postId]` on the table `PostImage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PostImage_postId_key" ON "PostImage"("postId");
