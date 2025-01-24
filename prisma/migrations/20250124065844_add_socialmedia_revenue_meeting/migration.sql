-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "brandName" TEXT,
    "agentName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "socialMedia" TEXT,
    "currentRevenue" TEXT,
    "purposeOfMeeting" TEXT,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);
