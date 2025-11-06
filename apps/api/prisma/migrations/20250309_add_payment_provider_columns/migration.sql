-- AlterTable
ALTER TABLE "PaymentSession"
ADD COLUMN     "provider" TEXT NOT NULL DEFAULT 'mock',
ADD COLUMN     "providerReference" TEXT;
