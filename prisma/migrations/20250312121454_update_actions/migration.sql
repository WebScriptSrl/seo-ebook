-- DropForeignKey
ALTER TABLE "customers" DROP CONSTRAINT "customers_userId_fkey";

-- DropForeignKey
ALTER TABLE "downloads" DROP CONSTRAINT "downloads_customerId_fkey";

-- DropForeignKey
ALTER TABLE "downloads" DROP CONSTRAINT "downloads_orderId_fkey";

-- DropForeignKey
ALTER TABLE "downloads" DROP CONSTRAINT "downloads_productId_fkey";

-- DropForeignKey
ALTER TABLE "downloads" DROP CONSTRAINT "downloads_userId_fkey";

-- DropForeignKey
ALTER TABLE "emails" DROP CONSTRAINT "emails_deletedUserId_fkey";

-- DropForeignKey
ALTER TABLE "emails" DROP CONSTRAINT "emails_newsletterSubscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "emails" DROP CONSTRAINT "emails_orderId_fkey";

-- DropForeignKey
ALTER TABLE "emails" DROP CONSTRAINT "emails_userId_fkey";

-- DropForeignKey
ALTER TABLE "newsletter_subscriptions" DROP CONSTRAINT "newsletter_subscriptions_userId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_customerId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_productId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_userId_fkey";

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "downloads" ADD CONSTRAINT "downloads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "downloads" ADD CONSTRAINT "downloads_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "downloads" ADD CONSTRAINT "downloads_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "downloads" ADD CONSTRAINT "downloads_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "newsletter_subscriptions" ADD CONSTRAINT "newsletter_subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emails" ADD CONSTRAINT "emails_newsletterSubscriptionId_fkey" FOREIGN KEY ("newsletterSubscriptionId") REFERENCES "newsletter_subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emails" ADD CONSTRAINT "emails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emails" ADD CONSTRAINT "emails_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emails" ADD CONSTRAINT "emails_deletedUserId_fkey" FOREIGN KEY ("deletedUserId") REFERENCES "deleted_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
