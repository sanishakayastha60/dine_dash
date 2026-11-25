/*
  Warnings:

  - You are about to drop the column `isVerfied` on the `BusinessInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BusinessInfo" DROP COLUMN "isVerfied",
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;
