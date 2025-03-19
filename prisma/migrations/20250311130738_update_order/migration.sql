-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "hosted_invoice_url" TEXT,
ADD COLUMN     "invoice_pdf" TEXT,
ADD COLUMN     "receipt_url" TEXT;
