/*
  Warnings:

  - You are about to drop the column `artistId` on the `notifications` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('arts', 'collections', 'payments');

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_artistId_fkey";

-- DropIndex
DROP INDEX "notifications_artistId_idx";

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "artistId",
ADD COLUMN     "notificationItemId" UUID,
ADD COLUMN     "notificationType" "NotificationType" NOT NULL DEFAULT 'arts';
