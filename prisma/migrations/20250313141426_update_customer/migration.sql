/*
  Warnings:

  - You are about to drop the column `address` on the `customers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "customers" DROP COLUMN "address",
ADD COLUMN     "addressOne" TEXT,
ADD COLUMN     "addressTwo" TEXT;
