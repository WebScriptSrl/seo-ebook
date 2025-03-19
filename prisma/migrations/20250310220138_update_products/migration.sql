/*
  Warnings:

  - A unique constraint covering the columns `[stripe_price_id]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripe_product_id]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "stripe_price_id" TEXT,
ADD COLUMN     "stripe_product_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "products_stripe_price_id_key" ON "products"("stripe_price_id");

-- CreateIndex
CREATE UNIQUE INDEX "products_stripe_product_id_key" ON "products"("stripe_product_id");
