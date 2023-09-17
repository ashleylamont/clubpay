-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateEnum
CREATE TYPE "ProviderType" AS ENUM ('OIDC', 'OAUTH2');

-- CreateTable
CREATE TABLE "AuthenticationProvider" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "providerType" "ProviderType" NOT NULL,
    "callbackUrl" TEXT,
    "authorisationUrl" TEXT,
    "tokenUrl" TEXT,
    "clientId" TEXT,
    "clientSecret" TEXT,

    CONSTRAINT "AuthenticationProvider_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthenticationProvider_name_key" ON "AuthenticationProvider"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AuthenticationProvider_callbackUrl_key" ON "AuthenticationProvider"("callbackUrl");

-- CreateIndex
CREATE UNIQUE INDEX "AuthenticationProvider_authorisationUrl_key" ON "AuthenticationProvider"("authorisationUrl");

-- CreateIndex
CREATE UNIQUE INDEX "AuthenticationProvider_tokenUrl_key" ON "AuthenticationProvider"("tokenUrl");

-- CreateIndex
CREATE UNIQUE INDEX "AuthenticationProvider_clientId_key" ON "AuthenticationProvider"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "AuthenticationProvider_clientSecret_key" ON "AuthenticationProvider"("clientSecret");
