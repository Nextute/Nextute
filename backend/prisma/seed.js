import prisma from "../db";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";

const seed = async () => {
  try {
    const hashedPassword = await bcrypt.hash("password123", 10);
    await prisma.institute.createMany({
      data: [
        {
          institute_id: `NXI_${nanoid(10)}`,
          institute_name: "Test Institute",
          email: "institute@example.com",
          password: hashedPassword,
          contact: "1234567890",
          is_verified: true,
        },
      ],
    });
    await prisma.student.createMany({
      data: [
        {
          student_id: `NXS_${nanoid(10)}`,
          name: "Test Student",
          email: "student@example.com",
          password: hashedPassword,
          gender: "Male",
          phone_number: "9876543210",
          date_of_birth: new Date("2000-01-01"),
          is_verified: true,
        },
      ],
    });
    console.log("Seeding completed");
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

seed();
