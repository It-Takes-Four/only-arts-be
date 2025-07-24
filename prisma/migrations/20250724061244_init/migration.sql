/*
  Warnings:

  - You are about to drop the column `userId` on the `arts` table. All the data in the column will be lost.
  - Added the required column `artistId` to the `arts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "arts" DROP CONSTRAINT "arts_userId_fkey";

-- AlterTable
ALTER TABLE "arts" DROP COLUMN "userId",
ADD COLUMN     "artistId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "artists" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "artists_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "artists_userId_key" ON "artists"("userId");

-- AddForeignKey
ALTER TABLE "artists" ADD CONSTRAINT "artists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arts" ADD CONSTRAINT "arts_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
