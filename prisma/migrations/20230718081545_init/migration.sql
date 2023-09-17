/*
  Warnings:

  - You are about to drop the column `authorisationUrl` on the `AuthenticationProvider` table. All the data in the column will be lost.
  - You are about to drop the column `callbackUrl` on the `AuthenticationProvider` table. All the data in the column will be lost.
  - You are about to drop the column `clientId` on the `AuthenticationProvider` table. All the data in the column will be lost.
  - You are about to drop the column `clientSecret` on the `AuthenticationProvider` table. All the data in the column will be lost.
  - You are about to drop the column `providerType` on the `AuthenticationProvider` table. All the data in the column will be lost.
  - You are about to drop the column `tokenUrl` on the `AuthenticationProvider` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "AuthenticationProvider_authorisationUrl_key";

-- DropIndex
DROP INDEX "AuthenticationProvider_callbackUrl_key";

-- DropIndex
DROP INDEX "AuthenticationProvider_clientId_key";

-- DropIndex
DROP INDEX "AuthenticationProvider_clientSecret_key";

-- DropIndex
DROP INDEX "AuthenticationProvider_tokenUrl_key";

-- AlterTable
ALTER TABLE "AuthenticationProvider" DROP COLUMN "authorisationUrl",
DROP COLUMN "callbackUrl",
DROP COLUMN "clientId",
DROP COLUMN "clientSecret",
DROP COLUMN "providerType",
DROP COLUMN "tokenUrl";
