/*
  Warnings:

  - You are about to drop the column `additional_info` on the `flat_share_requests` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `flat_share_requests` table. All the data in the column will be lost.
  - You are about to drop the column `flat_id` on the `flat_share_requests` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `flat_share_requests` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `flat_share_requests` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `flats` table. All the data in the column will be lost.
  - You are about to drop the column `posted_by` on the `flats` table. All the data in the column will be lost.
  - You are about to drop the column `rent_amount` on the `flats` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `flats` table. All the data in the column will be lost.
  - Added the required column `flatId` to the `flat_share_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `flat_share_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `flat_share_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postedBy` to the `flats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rentAmount` to the `flats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `flats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "flat_share_requests" DROP CONSTRAINT "flat_share_requests_flat_id_fkey";

-- DropForeignKey
ALTER TABLE "flat_share_requests" DROP CONSTRAINT "flat_share_requests_user_id_fkey";

-- DropForeignKey
ALTER TABLE "flats" DROP CONSTRAINT "flats_posted_by_fkey";

-- AlterTable
ALTER TABLE "flat_share_requests" DROP COLUMN "additional_info",
DROP COLUMN "created_at",
DROP COLUMN "flat_id",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
ADD COLUMN     "additionalInfo" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "flatId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "flats" DROP COLUMN "created_at",
DROP COLUMN "posted_by",
DROP COLUMN "rent_amount",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "postedBy" TEXT NOT NULL,
ADD COLUMN     "rentAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "flats" ADD CONSTRAINT "flats_postedBy_fkey" FOREIGN KEY ("postedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flat_share_requests" ADD CONSTRAINT "flat_share_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flat_share_requests" ADD CONSTRAINT "flat_share_requests_flatId_fkey" FOREIGN KEY ("flatId") REFERENCES "flats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
