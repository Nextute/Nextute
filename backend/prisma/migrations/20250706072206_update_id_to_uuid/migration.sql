/*
  Warnings:

  - You are about to drop the `admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `institutes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `students` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "admin";

-- DropTable
DROP TABLE "institutes";

-- DropTable
DROP TABLE "students";

-- CreateTable
CREATE TABLE "Institute" (
    "id" UUID NOT NULL,
    "institute_id" VARCHAR(20) NOT NULL,
    "institute_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "contact" VARCHAR(50),
    "basic_info" JSONB,
    "contact_details" JSONB,
    "courses" JSONB,
    "faculty_details" JSONB,
    "student_achievements" JSONB,
    "institute_achievements" JSONB,
    "facilities" JSONB,
    "social_media" JSONB,
    "media_gallery" JSONB,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "code" VARCHAR(10),
    "code_expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Institute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "address" TEXT,
    "course" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "code" TEXT,
    "code_expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Institute_institute_id_key" ON "Institute"("institute_id");

-- CreateIndex
CREATE UNIQUE INDEX "Institute_email_key" ON "Institute"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_phone_number_key" ON "Student"("phone_number");
