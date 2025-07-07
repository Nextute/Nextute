import prisma from "../db/index.js";
import { nanoid } from "nanoid";

const createStudent = async (student) => {
  const student_id = `NXS_${nanoid(6)}`;
  return await prisma.student.create({
    data: {
      student_id,
      name: student.name,
      email: student.email,
      password: student.password,
      gender: student.gender,
      phone_number: student.phoneNumber,
      date_of_birth: student.dateOfBirth,
      code: student.code,
      code_expires_at: student.code_expires_at,
      is_verified: false,
    },
  });
};

const findStudentByEmail = async (email) => {
  return await prisma.student.findUnique({
    where: { email },
  });
};

const findStudentByPhone = async (phone) => {
  return await prisma.student.findFirst({
    where: { phone_number: phone },
  });
};

const verifyStudent = async (email) => {
  return await prisma.student.update({
    where: { email },
    data: { is_verified: true, code: null, code_expires_at: null },
  });
};

const findStudentById = async (student_id) => {
  return await prisma.student.findUnique({
    where: { student_id },
  });
};

const isStudentIdUnique = async (student_id) => {
  const existingStudent = await findStudentById(student_id);
  return !existingStudent;
};

export {
  createStudent,
  findStudentByEmail,
  findStudentByPhone,
  verifyStudent,
  isStudentIdUnique,
  findStudentById,
};
