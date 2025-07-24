import prisma from "../db/index.js";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";

const seed = async () => {
  try {
    const hashedPassword = await bcrypt.hash("password123", 10);
    await prisma.institute.createMany({
      data: [
        {
          institute_id: `NXI_${nanoid(6)}`,
          institute_name: "Alpha Classes",
          email: "alpha@example.com",
          password: hashedPassword,
          contact: "9999999999",
          is_verified: true,
          basic_info: {
            name: "Alpha Classes",
            logoURL: "https://example.com/alpha-logo.jpg",
            description: "Premier coaching institute for JEE and NEET preparation"
          },
          contact_details: {
            headOffice: {
              address: "12/7 Silverleaf Apartments, Sector 9, Indrapuram, New Delhi – 110099"
            }
          },
          courses: {
            courses: [
              { name: "JEE" },
              { name: "NEET" },
              { name: "Class 12" }
            ]
          }
        },
        {
          institute_id: `NXI_${nanoid(6)}`,
          institute_name: "Beta Coaching Center",
          email: "beta@example.com",
          password: hashedPassword,
          contact: "8888888888",
          is_verified: true,
          basic_info: {
            name: "Beta Coaching Center",
            logoURL: "https://example.com/beta-logo.jpg",
            description: "Excellence in competitive exam preparation"
          },
          contact_details: {
            headOffice: {
              address: "45/2 Academic Complex, Sector 15, Noida – 201301"
            }
          },
          courses: {
            courses: [
              { name: "JEE" },
              { name: "GATE" },
              { name: "CAT" }
            ]
          }
        },
        {
          institute_id: `NXI_${nanoid(6)}`,
          institute_name: "Gamma Institute",
          email: "gamma@example.com",
          password: hashedPassword,
          contact: "7777777777",
          is_verified: true,
          basic_info: {
            name: "Gamma Institute",
            logoURL: "https://example.com/gamma-logo.jpg",
            description: "Leading institute for government job preparation"
          },
          contact_details: {
            headOffice: {
              address: "78/3 Education Hub, Karol Bagh, New Delhi – 110005"
            }
          },
          courses: {
            courses: [
              { name: "SSC CGL" },
              { name: "UPSC" },
              { name: "NDA" }
            ]
          }
        },
        {
          institute_id: `NXI_${nanoid(6)}`,
          institute_name: "Delta Academy",
          email: "delta@example.com",
          password: hashedPassword,
          contact: "6666666666",
          is_verified: true,
          basic_info: {
            name: "Delta Academy",
            logoURL: "https://example.com/delta-logo.jpg",
            description: "Specialized coaching for law entrance exams"
          },
          contact_details: {
            headOffice: {
              address: "23/1 Legal Complex, Connaught Place, New Delhi – 110001"
            }
          },
          courses: {
            courses: [
              { name: "CLAT" },
              { name: "CUET" },
              { name: "NIFT" }
            ]
          }
        },
        {
          institute_id: `NXI_${nanoid(6)}`,
          institute_name: "Epsilon Classes",
          email: "epsilon@example.com",
          password: hashedPassword,
          contact: "5555555555",
          is_verified: true,
          basic_info: {
            name: "Epsilon Classes",
            logoURL: "https://example.com/epsilon-logo.jpg",
            description: "Defense services preparation institute"
          },
          contact_details: {
            headOffice: {
              address: "56/4 Defense Colony, Lajpat Nagar, New Delhi – 110024"
            }
          },
          courses: {
            courses: [
              { name: "CDS" },
              { name: "AFCAT" },
              { name: "NDA" }
            ]
          }
        }
      ],
    });
    await prisma.student.createMany({
      data: [
        {
          student_id: `NXS_${nanoid(6)}`,
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
