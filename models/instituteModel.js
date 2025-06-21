import pool from "../db/index.js";

const createInstitute = async (institute) => {
  const {
    institute_id,
    institute_name,
    email,
    password,
    contact,
    code,
    code_expires_at,
  } = institute;

  const query = `
    INSERT INTO institutes 
      (institute_name, email, password, contact, code, code_expires_at, institute_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

  const values = [
    institute_name,
    email,
    password,
    contact,
    code,
    code_expires_at,
    institute_id,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

const updateInstituteSection = async (id, section, data) => {
  const validSections = [
    "basic_info",
    "contact_details",
    "courses",
    "faculty",
    "facilities",
    "social_media",
    "logo_url",
  ];

  if (!validSections.includes(section)) {
    throw new Error("Invalid section");
  }

  const query = `
    UPDATE institutes 
    SET ${section} = $1 
    WHERE id = $2
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [data, id]);
  return rows[0];
};

const findInstituteByEmail = async (email) => {
  const { rows } = await pool.query(
    "SELECT * FROM institutes WHERE email = $1",
    [email]
  );
  return rows[0];
};

const findInstituteByPhone = async (phone) => {
  const { rows } = await pool.query(
    "SELECT * FROM institutes WHERE contact->>'phone' = $1",
    [phone]
  );
  return rows[0];
};

const verifyInstitute = async (email) => {
  const { rows } = await pool.query(
    "UPDATE institutes SET is_verified = true, code = NULL WHERE email = $1 RETURNING *",
    [email]
  );
  return rows[0];
};

const isInstituteIdUnique = async (institute_id) => {
  const { rows } = await pool.query(
    "SELECT * FROM institutes WHERE institute_id = $1",
    [institute_id]
  );
  return rows.length === 0;
};

export {
  createInstitute,
  updateInstituteSection,
  findInstituteByEmail,
  findInstituteByPhone,
  verifyInstitute,
  isInstituteIdUnique,
};
