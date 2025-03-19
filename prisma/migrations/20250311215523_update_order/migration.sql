/*
  Warnings:

  - You are about to drop the `_OrderDownload` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `email` to the `emails` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_OrderDownload" DROP CONSTRAINT "_OrderDownload_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrderDownload" DROP CONSTRAINT "_OrderDownload_B_fkey";

-- AlterTable
ALTER TABLE "downloads" ADD COLUMN     "orderId" TEXT;

-- AlterTable
ALTER TABLE "emails" ADD COLUMN     "email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "downloadId" TEXT;

-- DropTable
DROP TABLE "_OrderDownload";

-- AddForeignKey
ALTER TABLE "downloads" ADD CONSTRAINT "downloads_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
