/*
  Warnings:

  - Changed the type of `body` on the `emails` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "emails" DROP COLUMN "body",
ADD COLUMN     "body" JSONB NOT NULL;
