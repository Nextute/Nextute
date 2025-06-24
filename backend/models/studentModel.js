import pool from "../db/index.js";

const createStudent = async (student) => {
  const query = `
    INSERT INTO students 
    (name, email, password, gender, phone_number, date_of_birth, code, code_expires_at, is_verified, student_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, false, $9)
    RETURNING *;
  `;

  const values = [
    student.name,
    student.email,
    student.password,
    student.gender,
    student.phoneNumber,
    student.dateOfBirth,
    student.code,
    student.code_expires_at,
    student.student_id,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

const findStudentByEmail = async (email) => {
  const { rows } = await pool.query("SELECT * FROM students WHERE email = $1", 
    [email])
    ;
  return rows[0];
};

const findStudentByPhone = async (phone) => {
  const { rows } = await pool.query(
    "SELECT * FROM students WHERE phone_number = $1",
    [phone]
  );
  return rows[0];
};

const verifyStudent = async (email) => {
  const { rows } = await pool.query(
    "UPDATE students SET is_verified = true, code = NULL WHERE email = $1 RETURNING *",
    [email]
  );
  return rows[0];
};

const findStudentById = async (student_id) => {
  const { rows } = await pool.query(
    "SELECT * FROM students WHERE student_id = $1",
    [student_id]
  );
  return rows[0];
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
