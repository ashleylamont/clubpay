/*
  Warnings:

  - You are about to drop the column `clubId` on the `Membership` table. All the data in the column will be lost.
  - Added the required column `membershipTypeId` to the `Membership` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "MembershipType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clubId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "price" REAL,
    "duration" INTEGER,
    "isAnnual" BOOLEAN NOT NULL,
    CONSTRAINT "MembershipType_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Membership" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "membershipTypeId" INTEGER NOT NULL,
    CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Membership_membershipTypeId_fkey" FOREIGN KEY ("membershipTypeId") REFERENCES "MembershipType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Membership" ("id", "userId") SELECT "id", "userId" FROM "Membership";
DROP TABLE "Membership";
ALTER TABLE "new_Membership" RENAME TO "Membership";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
