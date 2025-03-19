/*
  Warnings:

  - The `subscribed` column on the `newsletter_subscriptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "NewsletterState" AS ENUM ('PENDING', 'CONFIRMED', 'UNSUBSCRIBED');

-- AlterTable
ALTER TABLE "newsletter_subscriptions" ADD COLUMN     "confirmation_sent_at" TIMESTAMP(3),
ADD COLUMN     "confirmed_at" TIMESTAMP(3),
DROP COLUMN "subscribed",
ADD COLUMN     "subscribed" "NewsletterState" NOT NULL DEFAULT 'PENDING';
