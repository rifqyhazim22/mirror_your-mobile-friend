-- AlterTable
ALTER TABLE "Profile"
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "mbtiType" TEXT,
ADD COLUMN     "enneagramType" TEXT,
ADD COLUMN     "primaryArchetype" TEXT,
ADD COLUMN     "zodiacSign" TEXT,
ADD COLUMN     "personalityNotes" TEXT;
