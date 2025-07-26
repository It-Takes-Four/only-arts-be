/*
  Warnings:

  - You are about to drop the `Art` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ArtCollection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ArtTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ArtToArtTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ArtToCollection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Artist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Feed` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Follower` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Art" DROP CONSTRAINT "Art_artistId_fkey";

-- DropForeignKey
ALTER TABLE "ArtCollection" DROP CONSTRAINT "ArtCollection_artistId_fkey";

-- DropForeignKey
ALTER TABLE "ArtToArtTag" DROP CONSTRAINT "ArtToArtTag_artId_fkey";

-- DropForeignKey
ALTER TABLE "ArtToArtTag" DROP CONSTRAINT "ArtToArtTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "ArtToCollection" DROP CONSTRAINT "ArtToCollection_artId_fkey";

-- DropForeignKey
ALTER TABLE "ArtToCollection" DROP CONSTRAINT "ArtToCollection_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "Artist" DROP CONSTRAINT "Artist_userId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_artId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Feed" DROP CONSTRAINT "Feed_artistId_fkey";

-- DropForeignKey
ALTER TABLE "Follower" DROP CONSTRAINT "Follower_artistId_fkey";

-- DropForeignKey
ALTER TABLE "Follower" DROP CONSTRAINT "Follower_userId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_artistId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropTable
DROP TABLE "Art";

-- DropTable
DROP TABLE "ArtCollection";

-- DropTable
DROP TABLE "ArtTag";

-- DropTable
DROP TABLE "ArtToArtTag";

-- DropTable
DROP TABLE "ArtToCollection";

-- DropTable
DROP TABLE "Artist";

-- DropTable
DROP TABLE "Comment";

-- DropTable
DROP TABLE "Feed";

-- DropTable
DROP TABLE "Follower";

-- DropTable
DROP TABLE "Notification";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "profilePicture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artists" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "artistName" TEXT NOT NULL,
    "isNsfw" BOOLEAN NOT NULL DEFAULT false,
    "bio" TEXT,
    "walletAddress" TEXT,
    "totalFollowers" INTEGER NOT NULL DEFAULT 0,
    "totalArts" INTEGER NOT NULL DEFAULT 0,
    "totalCollections" INTEGER NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "followers" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "artistId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "followers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "arts" (
    "id" UUID NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "datePosted" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "artistId" UUID NOT NULL,
    "tokenId" BIGINT NOT NULL,
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "isForSale" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "arts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "art_likes" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "artId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "art_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,
    "artId" UUID NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "art_tags" (
    "id" UUID NOT NULL,
    "tagName" TEXT NOT NULL,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "art_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "art_collections" (
    "id" UUID NOT NULL,
    "collectionName" TEXT NOT NULL,
    "description" TEXT,
    "coverImageUrl" TEXT,
    "price" DECIMAL(18,8),
    "tokenId" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "artistId" UUID NOT NULL,

    CONSTRAINT "art_collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "art_to_collections" (
    "id" UUID NOT NULL,
    "artId" UUID NOT NULL,
    "collectionId" UUID NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "art_to_collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchases" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "collectionId" UUID NOT NULL,
    "price" DECIMAL(18,8) NOT NULL,
    "txHash" TEXT,
    "status" "PurchaseStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feeds" (
    "id" UUID NOT NULL,
    "artistId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "datePosted" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feeds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "art_to_art_tags" (
    "artId" UUID NOT NULL,
    "tagId" UUID NOT NULL,

    CONSTRAINT "art_to_art_tags_pkey" PRIMARY KEY ("artId","tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "artists_userId_key" ON "artists"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "artists_artistName_key" ON "artists"("artistName");

-- CreateIndex
CREATE UNIQUE INDEX "artists_walletAddress_key" ON "artists"("walletAddress");

-- CreateIndex
CREATE INDEX "artists_artistName_idx" ON "artists"("artistName");

-- CreateIndex
CREATE INDEX "artists_walletAddress_idx" ON "artists"("walletAddress");

-- CreateIndex
CREATE INDEX "artists_isVerified_idx" ON "artists"("isVerified");

-- CreateIndex
CREATE INDEX "followers_userId_idx" ON "followers"("userId");

-- CreateIndex
CREATE INDEX "followers_artistId_idx" ON "followers"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "followers_userId_artistId_key" ON "followers"("userId", "artistId");

-- CreateIndex
CREATE UNIQUE INDEX "arts_tokenId_key" ON "arts"("tokenId");

-- CreateIndex
CREATE INDEX "arts_artistId_idx" ON "arts"("artistId");

-- CreateIndex
CREATE INDEX "arts_tokenId_idx" ON "arts"("tokenId");

-- CreateIndex
CREATE INDEX "arts_datePosted_idx" ON "arts"("datePosted");

-- CreateIndex
CREATE INDEX "arts_isForSale_idx" ON "arts"("isForSale");

-- CreateIndex
CREATE INDEX "art_likes_artId_idx" ON "art_likes"("artId");

-- CreateIndex
CREATE UNIQUE INDEX "art_likes_userId_artId_key" ON "art_likes"("userId", "artId");

-- CreateIndex
CREATE INDEX "comments_artId_idx" ON "comments"("artId");

-- CreateIndex
CREATE INDEX "comments_userId_idx" ON "comments"("userId");

-- CreateIndex
CREATE INDEX "comments_createdAt_idx" ON "comments"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "art_tags_tagName_key" ON "art_tags"("tagName");

-- CreateIndex
CREATE INDEX "art_tags_tagName_idx" ON "art_tags"("tagName");

-- CreateIndex
CREATE UNIQUE INDEX "art_collections_tokenId_key" ON "art_collections"("tokenId");

-- CreateIndex
CREATE INDEX "art_collections_artistId_idx" ON "art_collections"("artistId");

-- CreateIndex
CREATE INDEX "art_collections_tokenId_idx" ON "art_collections"("tokenId");

-- CreateIndex
CREATE INDEX "art_to_collections_collectionId_idx" ON "art_to_collections"("collectionId");

-- CreateIndex
CREATE UNIQUE INDEX "art_to_collections_artId_collectionId_key" ON "art_to_collections"("artId", "collectionId");

-- CreateIndex
CREATE UNIQUE INDEX "purchases_txHash_key" ON "purchases"("txHash");

-- CreateIndex
CREATE INDEX "purchases_userId_idx" ON "purchases"("userId");

-- CreateIndex
CREATE INDEX "purchases_collectionId_idx" ON "purchases"("collectionId");

-- CreateIndex
CREATE INDEX "purchases_status_idx" ON "purchases"("status");

-- CreateIndex
CREATE INDEX "purchases_txHash_idx" ON "purchases"("txHash");

-- CreateIndex
CREATE INDEX "feeds_artistId_idx" ON "feeds"("artistId");

-- CreateIndex
CREATE INDEX "feeds_datePosted_idx" ON "feeds"("datePosted");

-- AddForeignKey
ALTER TABLE "artists" ADD CONSTRAINT "artists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followers" ADD CONSTRAINT "followers_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followers" ADD CONSTRAINT "followers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arts" ADD CONSTRAINT "arts_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "art_likes" ADD CONSTRAINT "art_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "art_likes" ADD CONSTRAINT "art_likes_artId_fkey" FOREIGN KEY ("artId") REFERENCES "arts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_artId_fkey" FOREIGN KEY ("artId") REFERENCES "arts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "art_collections" ADD CONSTRAINT "art_collections_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "art_to_collections" ADD CONSTRAINT "art_to_collections_artId_fkey" FOREIGN KEY ("artId") REFERENCES "arts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "art_to_collections" ADD CONSTRAINT "art_to_collections_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "art_collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "art_collections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feeds" ADD CONSTRAINT "feeds_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "art_to_art_tags" ADD CONSTRAINT "art_to_art_tags_artId_fkey" FOREIGN KEY ("artId") REFERENCES "arts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "art_to_art_tags" ADD CONSTRAINT "art_to_art_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "art_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
