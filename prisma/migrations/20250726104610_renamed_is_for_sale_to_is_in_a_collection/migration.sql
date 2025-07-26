/*
  Warnings:

  - You are about to drop the column `isForSale` on the `arts` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "arts_isForSale_idx";

-- AlterTable
ALTER TABLE "arts" DROP COLUMN "isForSale",
ADD COLUMN     "isInACollection" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "arts_isInACollection_idx" ON "arts"("isInACollection");
