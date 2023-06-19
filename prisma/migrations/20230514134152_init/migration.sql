-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Authentication" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "provider" TEXT NOT NULL,
    "providerUserId" TEXT NOT NULL,
    "providerData" TEXT,
    "passwordHash" TEXT,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Authentication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Authentication" ("id", "passwordHash", "provider", "providerData", "providerUserId", "userId") SELECT "id", "passwordHash", "provider", "providerData", "providerUserId", "userId" FROM "Authentication";
DROP TABLE "Authentication";
ALTER TABLE "new_Authentication" RENAME TO "Authentication";
CREATE INDEX "Authentication_provider_providerUserId_idx" ON "Authentication"("provider", "providerUserId");
CREATE UNIQUE INDEX "Authentication_provider_providerUserId_key" ON "Authentication"("provider", "providerUserId");
CREATE TABLE "new_Membership" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "membershipTypeId" INTEGER NOT NULL,
    CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Membership_membershipTypeId_fkey" FOREIGN KEY ("membershipTypeId") REFERENCES "MembershipType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Membership" ("id", "membershipTypeId", "userId") SELECT "id", "membershipTypeId", "userId" FROM "Membership";
DROP TABLE "Membership";
ALTER TABLE "new_Membership" RENAME TO "Membership";
CREATE TABLE "new_MembershipType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clubId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "price" REAL,
    "duration" INTEGER,
    "isAnnual" BOOLEAN NOT NULL,
    CONSTRAINT "MembershipType_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MembershipType" ("clubId", "duration", "id", "isAnnual", "name", "price") SELECT "clubId", "duration", "id", "isAnnual", "name", "price" FROM "MembershipType";
DROP TABLE "MembershipType";
ALTER TABLE "new_MembershipType" RENAME TO "MembershipType";
CREATE TABLE "new_Manager" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "clubId" INTEGER NOT NULL,
    "manageClub" BOOLEAN NOT NULL,
    "manageMembers" BOOLEAN NOT NULL,
    "createMembers" BOOLEAN NOT NULL,
    CONSTRAINT "Manager_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Manager_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Manager" ("clubId", "createMembers", "id", "manageClub", "manageMembers", "userId") SELECT "clubId", "createMembers", "id", "manageClub", "manageMembers", "userId" FROM "Manager";
DROP TABLE "Manager";
ALTER TABLE "new_Manager" RENAME TO "Manager";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
