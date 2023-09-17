/*
  Warnings:

  - The primary key for the `UserAuthentication` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "UserAuthentication" DROP CONSTRAINT "UserAuthentication_pkey",
ADD CONSTRAINT "UserAuthentication_pkey" PRIMARY KEY ("providerUserId", "providerId");
