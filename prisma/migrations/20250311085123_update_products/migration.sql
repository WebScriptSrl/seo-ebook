-- AlterTable
ALTER TABLE "products" ADD COLUMN     "stripe_promo_code" TEXT,
ADD COLUMN     "stripe_promo_code_expires" TIMESTAMP(3);
