/*
  Warnings:

  - You are about to drop the column `code_expires_at` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "code_expires_at",
ALTER COLUMN "course" DROP NOT NULL;
