/*
  Warnings:

  - You are about to drop the column `contactInfo` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `contactInfo` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "admins" DROP COLUMN "contactInfo",
ADD COLUMN     "contactNumber" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "contactInfo",
ADD COLUMN     "contactNumber" TEXT;
