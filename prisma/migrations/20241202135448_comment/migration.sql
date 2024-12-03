-- CreateTable
CREATE TABLE "CateGoryComments" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "parentId" INTEGER,
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CateGoryComments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CateGoryLikes" ADD CONSTRAINT "CateGoryLikes_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BlogCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CateGoryComments" ADD CONSTRAINT "CateGoryComments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CateGoryComments" ADD CONSTRAINT "CateGoryComments_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BlogCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CateGoryComments" ADD CONSTRAINT "CateGoryComments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "CateGoryComments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
