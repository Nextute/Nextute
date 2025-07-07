/*
  Warnings:

  - You are about to alter the column `institute_id` on the `Institute` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `VarChar(10)`.
  - A unique constraint covering the columns `[student_id]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `student_id` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Institute" ALTER COLUMN "institute_id" SET DATA TYPE VARCHAR(10);

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "code_expires_at" TIMESTAMP(3),
ADD COLUMN     "student_id" VARCHAR(10) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Student_student_id_key" ON "Student"("student_id");
