-- CreateTable
CREATE TABLE "Roast" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "title" TEXT,
    "summary" TEXT NOT NULL,
    "interesting" TEXT NOT NULL,
    "questionable" TEXT NOT NULL,
    "verdict" TEXT NOT NULL,
    "isBlock" BOOLEAN NOT NULL DEFAULT false,
    "blockedReason" TEXT,
    "scrapeFailed" BOOLEAN NOT NULL DEFAULT false,
    "ipHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Roast_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Roast_createdAt_idx" ON "Roast"("createdAt");

-- CreateIndex
CREATE INDEX "Roast_domain_idx" ON "Roast"("domain");

-- CreateIndex
CREATE INDEX "Roast_ipHash_idx" ON "Roast"("ipHash");
