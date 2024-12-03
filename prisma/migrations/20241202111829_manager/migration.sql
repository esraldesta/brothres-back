/*
  Warnings:

  - Added the required column `managerId` to the `BlogCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BlogCategory" ADD COLUMN     "managerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "BlogCategoryRelation" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "BlogCategory" ADD CONSTRAINT "BlogCategory_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
