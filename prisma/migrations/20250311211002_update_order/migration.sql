/*
  Warnings:

  - Added the required column `productName` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "paymentStatus" TEXT,
ADD COLUMN     "productName" TEXT NOT NULL;
