-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "sellComent" TEXT,
ADD COLUMN     "sellOpen" BOOLEAN NOT NULL DEFAULT true;
