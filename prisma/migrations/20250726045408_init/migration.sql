/*
  Warnings:

  - Added the required column `artistName` to the `Artist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "artistName" TEXT NOT NULL,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "isNsfw" BOOLEAN NOT NULL DEFAULT false;
