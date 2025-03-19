-- DropForeignKey
ALTER TABLE "emails" DROP CONSTRAINT "emails_newsletterSubscriptionId_fkey";

-- AlterTable
ALTER TABLE "emails" ALTER COLUMN "newsletterSubscriptionId" DROP NOT NULL,
ALTER COLUMN "body" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "emails" ADD CONSTRAINT "emails_newsletterSubscriptionId_fkey" FOREIGN KEY ("newsletterSubscriptionId") REFERENCES "newsletter_subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
