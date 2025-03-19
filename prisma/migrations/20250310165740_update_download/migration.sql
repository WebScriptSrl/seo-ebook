/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `downloads` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `downloads` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "downloads" ADD COLUMN     "key" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "currency" TEXT,
ADD COLUMN     "key" TEXT NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "downloads_key_key" ON "downloads"("key");

-- CreateIndex
CREATE UNIQUE INDEX "products_key_key" ON "products"("key");
