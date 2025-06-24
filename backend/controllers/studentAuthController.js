import bcrypt from "bcrypt";
import { createSecretToken } from "../config/jwt.js";
import sendVerificationEmail from "../utils/emailSender.js";
import {
  createStudent,
  findStudentByEmail,
  findStudentByPhone,
  verifyStudent,
  isStudentIdUnique,
} from "../models/studentModel.js";
import { handleError } from "../utils/errorHandler.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, gender, phoneNumber, dateOfBirth } =
      req.body;
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const existing = await findStudentByEmail(email);
    if (existing) {
      return handleError(res, 400, "Email already exists", "EMAIL_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const generateRandomString = (length) => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    let student_id;
    let isUnique = false;
    const maxAttempts = 10;
    let attempts = 0;

    while (!isUnique && attempts < maxAttempts) {
      const randomPart = generateRandomString(6);
      student_id = `NXS_${randomPart}`;
      isUnique = await isStudentIdUnique(student_id);
      attempts++;

      if (attempts === maxAttempts && !isUnique) {
        throw new Error(
          "Could not generate unique student ID after multiple attempts"
        );
      }
    }

    const studentData = {
      student_id,
      name,
      email,
      password: hashedPassword,
      gender,
      phoneNumber,
      dateOfBirth,
      is_verified: false,
      code,
      code_expires_at: expiresAt,
    };

    const student = await createStudent(studentData);

    const token = createSecretToken(student.id, "student");

    // Set cookies in the response
    res.cookie("authToken", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.cookie("user", JSON.stringify(student), {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    if (typeof sendVerificationEmail !== "function") {
      console.error("sendVerificationEmail is not a function");
      return res.status(201).json({
        message:
          "Account created! Verification email could not be sent. Please contact support.",
      });
    }

    try {
      await sendVerificationEmail(email, code);
      res
        .status(201)
        .json({ message: "Verification code sent", token, user: student });
    } catch (emailErr) {
      console.error("Email error (user still created):", emailErr);
      res.status(201).json({
        message:
          "Account created! Check your email. If you don’t receive a code, contact support.",
      });
    }
  } catch (err) {
    handleError(
      res,
      500,
      err.message || "Server error during signup",
      "REGISTRATION_ERROR"
    );
  }
};

export const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return handleError(
        res,
        400,
        "Email and verification code are required",
        "MISSING_FIELDS"
      );
    }

    const student = await findStudentByEmail(email);
    const now = new Date();

    if (
      !student ||
      student.code !== code ||
      new Date(student.code_expires_at) < now
    ) {
      return handleError(
        res,
        400,
        "Invalid or expired verification code",
        "INVALID_CODE"
      );
    }

    await verifyStudent(email);
    res.status(200).json({ message: "Email verified" });
  } catch (err) {
    handleError(
      res,
      500,
      err.message || "Server error during email verification",
      "VERIFICATION_ERROR"
    );
  }
};

export const login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if ((!email && !phone) || (email && phone)) {
      return handleError(
        res,
        400,
        "Please provide either email or phone number",
        "INVALID_INPUT"
      );
    }

    if (!password) {
      return handleError(res, 400, "Password is required", "MISSING_PASSWORD");
    }

    let student;

    if (email) {
      student = await findStudentByEmail(email);
    } else {
      student = await findStudentByPhone(phone);
    }

    if (!student) {
      return handleError(res, 404, "Student not found", "STUDENT_NOT_FOUND");
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return handleError(
        res,
        401,
        "Invalid credentials",
        "INVALID_CREDENTIALS"
      );
    }

    const { password: _, code, ...safeStudent } = student;
    const token = createSecretToken(student.id, "student");

    // Set cookies in the response
    res.cookie("authToken", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.cookie("user", JSON.stringify(safeStudent), {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: "Login successful",
      token,
      user: safeStudent,
    });
  } catch (err) {
    console.error("Login error:", err);
    handleError(
      res,
      500,
      err.message || "Internal server error",
      "LOGIN_ERROR"
    );
  }
};

export const getStudentProfile = async (req, res) => {
  try {
    const student = req.student;

    if (!student) {
      return handleError(res, 404, "Student not found", "STUDENT_NOT_FOUND");
    }

    const { password, reset_token, ...safeStudent } = student;

    res.status(200).json({
      status: true,
      data: safeStudent,
    });
  } catch (err) {
    console.error("Profile route error:", err);
    handleError(
      res,
      500,
      err.message || "Failed to fetch profile",
      "PROFILE_ERROR"
    );
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("authToken");
    res.clearCookie("user");
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout error", err);
    handleError(
      res,
      500,
      err.message || "Server error during logout.",
      "LOGOUT_ERROR"
    );
  }
};
