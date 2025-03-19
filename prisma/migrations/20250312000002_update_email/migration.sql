/*
  Warnings:

  - You are about to drop the column `email` on the `emails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "emails" DROP COLUMN "email",
ADD COLUMN     "emails" TEXT[];
