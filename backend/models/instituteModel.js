import prisma from "../db/index.js";
import { nanoid } from "nanoid";

const createInstitute = async (institute) => {
  const institute_id = `NXI_${nanoid(6)}`;
  return await prisma.institute.create({
    data: {
      institute_id,
      institute_name: institute.institute_name,
      email: institute.email,
      password: institute.password,
      contact: institute.contact,
      code: institute.code,
      code_expires_at: institute.code_expires_at,
    },
  });
};

const updateInstituteSection = async (id, column, data) => {
  const validSections = [
    "basic_info",
    "contact_details",
    "courses",
    "faculty_details",
    "student_achievements",
    "institute_achievements",
    "facilities",
    "social_media",
    "media_gallery",
  ];

  if (!validSections.includes(column)) {
    throw new Error("Invalid section");
  }

  return await prisma.institute.update({
    where: { id },
    data: { [column]: data, updated_at: new Date() },
  });
};

const findInstituteByEmail = async (email) => {
  return await prisma.institute.findUnique({
    where: { email },
  });
};

const findInstituteByPhone = async (phone) => {
  return await prisma.institute.findFirst({
    where: { contact: phone },
  });
};

const verifyInstitute = async (email) => {
  return await prisma.institute.update({
    where: { email },
    data: { is_verified: true, code: null, code_expires_at: null },
  });
};

const isInstituteIdUnique = async (institute_id) => {
  const institute = await prisma.institute.findUnique({
    where: { institute_id },
  });
  return !institute;
};

export {
  createInstitute,
  updateInstituteSection,
  findInstituteByEmail,
  findInstituteByPhone,
  verifyInstitute,
  isInstituteIdUnique,
};
