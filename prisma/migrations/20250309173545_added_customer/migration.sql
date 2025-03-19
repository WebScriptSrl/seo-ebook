/*
  Warnings:

  - You are about to drop the column `link` on the `downloads` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[emailId]` on the table `emails` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `discount` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productPrice` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipping` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tax` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "downloads" DROP COLUMN "link",
ADD COLUMN     "customerId" TEXT,
ADD COLUMN     "url" TEXT;

-- AlterTable
ALTER TABLE "emails" ADD COLUMN     "emailId" TEXT;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "customerId" TEXT,
ADD COLUMN     "discount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "paymentIntentId" TEXT,
ADD COLUMN     "paymentMethodId" TEXT,
ADD COLUMN     "paymentMethodType" TEXT,
ADD COLUMN     "productPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "shipping" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "stripePaymentIntentId" TEXT,
ADD COLUMN     "tax" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "customerId" TEXT;

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "downloadId" TEXT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_userId_key" ON "customers"("userId");

-- CreateIndex
CREATE INDEX "customers_userId_idx" ON "customers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "emails_emailId_key" ON "emails"("emailId");

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "downloads" ADD CONSTRAINT "downloads_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
