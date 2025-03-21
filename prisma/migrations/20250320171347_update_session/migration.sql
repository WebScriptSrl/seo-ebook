/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `sell_sessions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `sell_sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sell_sessions" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "sell_sessions_name_key" ON "sell_sessions"("name");
