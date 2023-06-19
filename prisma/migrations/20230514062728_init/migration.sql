-- CreateTable
CREATE TABLE "Manager" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "clubId" INTEGER NOT NULL,
    "manageClub" BOOLEAN NOT NULL,
    "manageMembers" BOOLEAN NOT NULL,
    "createMembers" BOOLEAN NOT NULL,
    CONSTRAINT "Manager_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Manager_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
