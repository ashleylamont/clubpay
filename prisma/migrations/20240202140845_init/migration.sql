/*
  Warnings:

  - You are about to drop the column `fixedValue` on the `Club` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Club` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Club_fixedValue_key";

-- AlterTable
ALTER TABLE "Club" DROP COLUMN "fixedValue",
ALTER COLUMN "id" SET DEFAULT 'club';

-- CreateIndex
CREATE UNIQUE INDEX "Club_id_key" ON "Club"("id");
