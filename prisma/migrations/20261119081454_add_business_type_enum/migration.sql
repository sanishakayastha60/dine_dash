/*
  Warnings:

  - Added the required column `businessType` to the `BusinessInfo` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('RESTAURANT', 'CLOUD_KITCHEN', 'BAKERY', 'CAFE');

-- AlterTable
ALTER TABLE "BusinessInfo" ADD COLUMN     "businessType" "BusinessType" NOT NULL;
