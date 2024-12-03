/*
  Warnings:

  - You are about to drop the column `thumbnail` on the `Blogs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Blogs" DROP COLUMN "thumbnail",
ADD COLUMN     "VideoLink" TEXT;
