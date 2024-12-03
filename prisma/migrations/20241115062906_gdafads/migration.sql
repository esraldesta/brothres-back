/*
  Warnings:

  - You are about to drop the column `VideoLink` on the `Blogs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Blogs" DROP COLUMN "VideoLink",
ADD COLUMN     "videoLink" TEXT;
