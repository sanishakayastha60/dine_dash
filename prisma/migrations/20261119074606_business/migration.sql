/*
  Warnings:

  - You are about to drop the `FoodItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "FoodItem";

-- CreateTable
CREATE TABLE "BusinessInfo" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startHour" INTEGER NOT NULL,
    "endHour" INTEGER NOT NULL,
    "description" TEXT,
    "address" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "specialNotice" TEXT,
    "coverUrl" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessInfo_phoneNumber_key" ON "BusinessInfo"("phoneNumber");
