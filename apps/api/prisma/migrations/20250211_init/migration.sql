-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "focusAreas" TEXT[],
    "consentCamera" BOOLEAN NOT NULL,
    "consentData" BOOLEAN NOT NULL,
    "moodBaseline" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoodEntry" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "mood" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MoodEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Profile_ownerId_idx" ON "Profile"("ownerId");

-- CreateIndex
CREATE INDEX "MoodEntry_profileId_idx" ON "MoodEntry"("profileId");

-- AddForeignKey
ALTER TABLE "MoodEntry" ADD CONSTRAINT "MoodEntry_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

