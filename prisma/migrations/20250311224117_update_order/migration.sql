/*
  Warnings:

  - A unique constraint covering the columns `[sessionId]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sessionId` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "sessionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "orders_sessionId_key" ON "orders"("sessionId");
