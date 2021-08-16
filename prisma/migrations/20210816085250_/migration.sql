/*
  Warnings:

  - A unique constraint covering the columns `[socialId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "socialId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User.socialId_unique" ON "User"("socialId");
