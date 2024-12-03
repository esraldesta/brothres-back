/*
  Warnings:

  - You are about to drop the `_CategoryParents` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CategoryStatus" AS ENUM ('ACCEPTED', 'PENDING');

-- DropForeignKey
ALTER TABLE "_CategoryParents" DROP CONSTRAINT "_CategoryParents_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryParents" DROP CONSTRAINT "_CategoryParents_B_fkey";

-- DropTable
DROP TABLE "_CategoryParents";

-- CreateTable
CREATE TABLE "BlogCategoryRelation" (
    "id" SERIAL NOT NULL,
    "childId" INTEGER NOT NULL,
    "parentId" INTEGER NOT NULL,
    "status" "CategoryStatus" NOT NULL,

    CONSTRAINT "BlogCategoryRelation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlogCategoryRelation_childId_parentId_key" ON "BlogCategoryRelation"("childId", "parentId");

-- AddForeignKey
ALTER TABLE "BlogCategoryRelation" ADD CONSTRAINT "BlogCategoryRelation_childId_fkey" FOREIGN KEY ("childId") REFERENCES "BlogCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogCategoryRelation" ADD CONSTRAINT "BlogCategoryRelation_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "BlogCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
