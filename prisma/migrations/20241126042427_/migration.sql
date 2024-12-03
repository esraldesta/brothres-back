-- AlterTable
ALTER TABLE "User" ADD COLUMN     "languagesToLearn" TEXT[] DEFAULT ARRAY[]::TEXT[];
