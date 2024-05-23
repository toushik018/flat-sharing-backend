/*
  Warnings:

  - You are about to drop the column `additionalInfo` on the `flat_share_requests` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "flat_share_requests" DROP COLUMN "additionalInfo",
ADD COLUMN     "lengthOfStay" TEXT,
ADD COLUMN     "moveInDate" TEXT;
