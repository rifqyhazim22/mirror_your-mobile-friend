-- AlterTable
ALTER TABLE "Profile"
ADD COLUMN     "premiumPlanId" TEXT,
ADD COLUMN     "premiumStatus" TEXT NOT NULL DEFAULT 'free',
ADD COLUMN     "premiumActiveSince" TIMESTAMP(3);
