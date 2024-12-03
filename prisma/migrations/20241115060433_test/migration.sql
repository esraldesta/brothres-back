/*
  Warnings:

  - Added the required column `blogType` to the `Blog` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BlogType" AS ENUM ('VBlog', 'Blog');

-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "blogType" "BlogType" NOT NULL,
ADD COLUMN     "thumbnail" TEXT;
