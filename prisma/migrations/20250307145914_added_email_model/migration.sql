/*
  Warnings:

  - The values [UNSUBSCRIBED] on the enum `NewsletterState` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `confirmation_sent_at` on the `newsletter_subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `confirmed_at` on the `newsletter_subscriptions` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NewsletterState_new" AS ENUM ('NEW', 'PENDING', 'CONFIRMED');
ALTER TABLE "newsletter_subscriptions" ALTER COLUMN "subscribed" DROP DEFAULT;
ALTER TABLE "newsletter_subscriptions" ALTER COLUMN "subscribed" TYPE "NewsletterState_new" USING ("subscribed"::text::"NewsletterState_new");
ALTER TYPE "NewsletterState" RENAME TO "NewsletterState_old";
ALTER TYPE "NewsletterState_new" RENAME TO "NewsletterState";
DROP TYPE "NewsletterState_old";
ALTER TABLE "newsletter_subscriptions" ALTER COLUMN "subscribed" SET DEFAULT 'NEW';
COMMIT;

-- AlterTable
ALTER TABLE "newsletter_subscriptions" DROP COLUMN "confirmation_sent_at",
DROP COLUMN "confirmed_at",
ADD COLUMN     "unsubscribed" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "subscribed" SET DEFAULT 'NEW';

-- AlterTable
ALTER TABLE "stats" ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "emails" (
    "id" TEXT NOT NULL,
    "newsletterSubscriptionId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "userId" TEXT,
    "orderId" TEXT,
    "deletedUserId" TEXT,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3),
    "openedAt" TIMESTAMP(3),
    "clickedAt" TIMESTAMP(3),
    "complainedAt" TIMESTAMP(3),
    "bouncedAt" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "emails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "emails" ADD CONSTRAINT "emails_newsletterSubscriptionId_fkey" FOREIGN KEY ("newsletterSubscriptionId") REFERENCES "newsletter_subscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emails" ADD CONSTRAINT "emails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emails" ADD CONSTRAINT "emails_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emails" ADD CONSTRAINT "emails_deletedUserId_fkey" FOREIGN KEY ("deletedUserId") REFERENCES "deleted_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
