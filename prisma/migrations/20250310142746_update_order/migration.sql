/*
  Warnings:

  - You are about to drop the column `stripePaymentIntentId` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "stripePaymentIntentId",
ALTER COLUMN "total" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "discount" DROP NOT NULL,
ALTER COLUMN "shipping" DROP NOT NULL,
ALTER COLUMN "tax" DROP NOT NULL;
