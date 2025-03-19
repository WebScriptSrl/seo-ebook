/*
  Warnings:

  - The `value` column on the `stats` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "stats" DROP COLUMN "value",
ADD COLUMN     "value" DOUBLE PRECISION NOT NULL DEFAULT 0;
