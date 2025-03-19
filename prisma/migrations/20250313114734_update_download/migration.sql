/*
  Warnings:

  - A unique constraint covering the columns `[sessionId]` on the table `downloads` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "downloads_key_key";

-- AlterTable
ALTER TABLE "downloads" ADD COLUMN     "sessionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "downloads_sessionId_key" ON "downloads"("sessionId");
