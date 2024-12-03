/*
  Warnings:

  - You are about to drop the column `cateGoryId` on the `CateGoryLikes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,categoryId]` on the table `CateGoryContributors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,categoryId]` on the table `CateGoryFollowers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,categoryId]` on the table `CateGoryLikes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,categoryId]` on the table `CateGoryMembers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryId` to the `CateGoryLikes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CateGoryLikes" DROP COLUMN "cateGoryId",
ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CateGoryContributors_userId_categoryId_key" ON "CateGoryContributors"("userId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "CateGoryFollowers_userId_categoryId_key" ON "CateGoryFollowers"("userId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "CateGoryLikes_userId_categoryId_key" ON "CateGoryLikes"("userId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "CateGoryMembers_userId_categoryId_key" ON "CateGoryMembers"("userId", "categoryId");
