/*
  Warnings:

  - A unique constraint covering the columns `[userId,trackKey,date]` on the table `UserActivity` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "UserActivity_userId_trackKey_createdAt_key";

-- CreateIndex
CREATE UNIQUE INDEX "UserActivity_userId_trackKey_date_key" ON "UserActivity"("userId", "trackKey", "date");
