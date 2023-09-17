/*
  Warnings:

  - The primary key for the `UserAuthentication` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `UserAuthentication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserAuthentication" DROP CONSTRAINT "UserAuthentication_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "UserAuthentication_pkey" PRIMARY KEY ("userId", "providerId");
