/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `banned_users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "slug" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "banned_users_email_key" ON "banned_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "products_title_key" ON "products"("title");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");
