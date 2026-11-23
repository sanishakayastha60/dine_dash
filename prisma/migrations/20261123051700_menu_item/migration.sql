/*
  Warnings:

  - You are about to drop the column `endHour` on the `BusinessInfo` table. All the data in the column will be lost.
  - You are about to drop the column `startHour` on the `BusinessInfo` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MenuSection" AS ENUM ('RECOMMENDED', 'STARTER', 'MAIN_COURSE', 'FAST_FOOD', 'BEVERAGE', 'DESSERT');

-- AlterEnum
ALTER TYPE "BusinessType" ADD VALUE 'OTHER';

-- AlterTable
ALTER TABLE "BusinessInfo" DROP COLUMN "endHour",
DROP COLUMN "startHour";

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "estimatedTime" INTEGER NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
