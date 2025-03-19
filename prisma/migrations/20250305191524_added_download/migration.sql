/*
  Warnings:

  - A unique constraint covering the columns `[unsubscribe_token]` on the table `newsletter_subscriptions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[validation_token]` on the table `newsletter_subscriptions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "newsletter_subscriptions" ADD COLUMN     "unsubscribe_token" TEXT,
ADD COLUMN     "unsubscribe_token_expires" TIMESTAMP(3),
ADD COLUMN     "validation_token" TEXT,
ADD COLUMN     "validation_token_expires" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "downloads" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "productId" TEXT,
    "link" TEXT,
    "expires" TIMESTAMP(3),
    "used" BOOLEAN NOT NULL DEFAULT false,
    "activated" TIMESTAMP(3),
    "ip" TEXT,
    "location" TEXT,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "downloads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DownloadToOrder" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "downloads_userId_idx" ON "downloads"("userId");

-- CreateIndex
CREATE INDEX "downloads_productId_idx" ON "downloads"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "_DownloadToOrder_AB_unique" ON "_DownloadToOrder"("A", "B");

-- CreateIndex
CREATE INDEX "_DownloadToOrder_B_index" ON "_DownloadToOrder"("B");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscriptions_unsubscribe_token_key" ON "newsletter_subscriptions"("unsubscribe_token");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscriptions_validation_token_key" ON "newsletter_subscriptions"("validation_token");

-- AddForeignKey
ALTER TABLE "downloads" ADD CONSTRAINT "downloads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "downloads" ADD CONSTRAINT "downloads_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DownloadToOrder" ADD CONSTRAINT "_DownloadToOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "downloads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DownloadToOrder" ADD CONSTRAINT "_DownloadToOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
