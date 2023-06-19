/*
  Warnings:

  - A unique constraint covering the columns `[provider,providerUserId]` on the table `Authentication` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Authentication_provider_providerUserId_idx" ON "Authentication"("provider", "providerUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Authentication_provider_providerUserId_key" ON "Authentication"("provider", "providerUserId");
