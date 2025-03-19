/*
  Warnings:

  - A unique constraint covering the columns `[orderId]` on the table `downloads` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "downloads_orderId_key" ON "downloads"("orderId");
