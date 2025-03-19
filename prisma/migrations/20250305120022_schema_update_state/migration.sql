/*
  Warnings:

  - The `approved` column on the `reviews` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ReviewState" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "approved",
ADD COLUMN     "approved" "ReviewState" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "ReviewSate";
