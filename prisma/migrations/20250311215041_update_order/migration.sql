/*
  Warnings:

  - You are about to drop the `_DownloadToOrder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_DownloadToOrder" DROP CONSTRAINT "_DownloadToOrder_A_fkey";

-- DropForeignKey
ALTER TABLE "_DownloadToOrder" DROP CONSTRAINT "_DownloadToOrder_B_fkey";

-- DropTable
DROP TABLE "_DownloadToOrder";

-- CreateTable
CREATE TABLE "_OrderDownload" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OrderDownload_AB_unique" ON "_OrderDownload"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderDownload_B_index" ON "_OrderDownload"("B");

-- AddForeignKey
ALTER TABLE "_OrderDownload" ADD CONSTRAINT "_OrderDownload_A_fkey" FOREIGN KEY ("A") REFERENCES "downloads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderDownload" ADD CONSTRAINT "_OrderDownload_B_fkey" FOREIGN KEY ("B") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
