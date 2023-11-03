-- CreateTable
CREATE TABLE "UserPermissions" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "manageMembers" BOOLEAN NOT NULL DEFAULT false,
    "manageMemberships" BOOLEAN NOT NULL DEFAULT false,
    "manageEvents" BOOLEAN NOT NULL DEFAULT false,
    "manageClub" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserPermissions_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPermissions_userId_key" ON "UserPermissions"("userId");

-- AddForeignKey
ALTER TABLE "UserPermissions" ADD CONSTRAINT "UserPermissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
