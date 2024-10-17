-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "imageUrl" DROP NOT NULL,
ALTER COLUMN "imageId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "PostImage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ImageStatus" NOT NULL DEFAULT 'pending',
    "imageMetaId" TEXT,
    "urlOriginal" TEXT,
    "urlLarge" TEXT,
    "urlSmall" TEXT,
    "postId" TEXT NOT NULL,

    CONSTRAINT "PostImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostImage_imageMetaId_key" ON "PostImage"("imageMetaId");

-- CreateIndex
CREATE INDEX "Post_description_idx" ON "Post"("description");

-- AddForeignKey
ALTER TABLE "PostImage" ADD CONSTRAINT "PostImage_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
