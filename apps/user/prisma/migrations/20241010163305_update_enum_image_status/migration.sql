/*
  Warnings:

  - The values [success] on the enum `ImageStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ImageStatus_new" AS ENUM ('pending', 'failed', 'completed');
ALTER TABLE "ProfileImage" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ProfileImage" ALTER COLUMN "status" TYPE "ImageStatus_new" USING ("status"::text::"ImageStatus_new");
ALTER TYPE "ImageStatus" RENAME TO "ImageStatus_old";
ALTER TYPE "ImageStatus_new" RENAME TO "ImageStatus";
DROP TYPE "ImageStatus_old";
ALTER TABLE "ProfileImage" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;
