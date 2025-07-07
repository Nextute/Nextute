-- CreateTable
CREATE TABLE "admin" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "admin_name" VARCHAR(255) NOT NULL,
    "admin_email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institutes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "institute_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "contact" VARCHAR(20) NOT NULL,
    "code" VARCHAR(6),
    "is_verified" BOOLEAN DEFAULT false,
    "basic_info" JSONB DEFAULT '{}',
    "contact_details" JSONB DEFAULT '{}',
    "courses" JSONB DEFAULT '{}',
    "faculty_details" JSONB DEFAULT '{}',
    "facilities" JSONB DEFAULT '[]',
    "social_media" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "code_expires_at" TIMESTAMP(6),
    "institute_id" VARCHAR(10) NOT NULL,
    "student_achievements" JSONB DEFAULT '{}',
    "institute_achievements" JSONB DEFAULT '{}',
    "media_gallery" JSONB DEFAULT '{}',

    CONSTRAINT "institutes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "address" TEXT,
    "course" TEXT,
    "date_of_birth" DATE NOT NULL,
    "code" TEXT,
    "is_verified" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "code_expires_at" TIMESTAMP(6),
    "student_id" VARCHAR(10) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_admin_email_key" ON "admin"("admin_email");

-- CreateIndex
CREATE UNIQUE INDEX "institutes_email_key" ON "institutes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "institutes_institute_id_key" ON "institutes"("institute_id");

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");

-- CreateIndex
CREATE UNIQUE INDEX "students_phone_number_key" ON "students"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "students_student_id_key" ON "students"("student_id");
