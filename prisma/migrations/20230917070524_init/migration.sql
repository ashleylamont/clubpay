/*
  Warnings:

  - The primary key for the `UserAuthentication` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `providerId` on the `UserAuthentication` table. All the data in the column will be lost.
  - You are about to drop the `AuthenticationProvider` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `provider` to the `UserAuthentication` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserAuthentication" DROP CONSTRAINT "UserAuthentication_providerId_fkey";

-- AlterTable
ALTER TABLE "UserAuthentication" DROP CONSTRAINT "UserAuthentication_pkey",
DROP COLUMN "providerId",
ADD COLUMN     "provider" TEXT NOT NULL,
ADD CONSTRAINT "UserAuthentication_pkey" PRIMARY KEY ("providerUserId", "provider");

-- DropTable
DROP TABLE "AuthenticationProvider";
