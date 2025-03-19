/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `deleted_users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `deleted_users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "deleted_users" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "deleted_users_email_key" ON "deleted_users"("email");
