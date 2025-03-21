/*
  Warnings:

  - You are about to drop the column `sellComent` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `sellOpen` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "sellComent",
DROP COLUMN "sellOpen";

-- CreateTable
CREATE TABLE "sell_sessions" (
    "id" TEXT NOT NULL,
    "sellStop" BOOLEAN NOT NULL DEFAULT false,
    "showBanner" BOOLEAN NOT NULL DEFAULT false,
    "bannerTitle" TEXT,
    "description" TEXT,

    CONSTRAINT "sell_sessions_pkey" PRIMARY KEY ("id")
);
