/*
  Warnings:

  - You are about to drop the column `status` on the `Category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "status";

-- CreateTable
CREATE TABLE "BusinessCategory" (
    "id" TEXT NOT NULL,
    "businessInfoId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "BusinessCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessCategory_businessInfoId_categoryId_key" ON "BusinessCategory"("businessInfoId", "categoryId");

-- AddForeignKey
ALTER TABLE "BusinessCategory" ADD CONSTRAINT "BusinessCategory_businessInfoId_fkey" FOREIGN KEY ("businessInfoId") REFERENCES "BusinessInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessCategory" ADD CONSTRAINT "BusinessCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
