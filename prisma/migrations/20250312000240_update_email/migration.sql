-- AlterTable
ALTER TABLE "emails" ADD COLUMN     "delivered" BOOLEAN DEFAULT false,
ADD COLUMN     "deliveredAt" TIMESTAMP(3);
