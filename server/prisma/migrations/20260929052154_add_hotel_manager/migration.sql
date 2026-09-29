/*
  Warnings:

  - A unique constraint covering the columns `[managerId]` on the table `Hotel` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Hotel" ADD COLUMN     "managerId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Hotel_managerId_key" ON "Hotel"("managerId");

-- AddForeignKey
ALTER TABLE "Hotel" ADD CONSTRAINT "Hotel_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
