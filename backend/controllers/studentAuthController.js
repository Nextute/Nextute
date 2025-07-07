import bcrypt from "bcrypt";
import { createSecretToken } from "../config/jwt.js";
import sendVerificationEmail from "../utils/emailSender.js";
import {
  createStudent,
  findStudentByEmail,
  findStudentByPhone,
  verifyStudent,
} from "../models/studentModel.js";
import { handleError } from "../utils/errorHandler.js";
import { body, validationResult } from "express-validator";

export const signup = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().normalizeEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("gender")
    .optional()
    .isIn(["Male", "Female", "Other"])
    .withMessage("Invalid gender"),
  body("phoneNumber")
    .optional()
    .isMobilePhone("any")
    .withMessage("Invalid phone number"),
  body("dateOfBirth")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Invalid date of birth"),
    
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleError(res, 400, errors.array()[0].msg, "VALIDATION_ERROR");
    }

   
      const { name, email, password, gender, phoneNumber, dateOfBirth } =
        req.body;
        // console.log(name, email, password, gender, phoneNumber, dateOfBirth)
      const existing = await findStudentByEmail(email);
        if (existing) {
          return handleError(res, 400, "Email already exists", "EMAIL_EXISTS");
        }
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      // console.log("hashedPassword:",hashedPassword,"code:", code, "expiresAt:", expiresAt)

      const studentData = {
        name,
        email,
        password: hashedPassword,
        gender,
        phoneNumber,
        dateOfBirth,
        code,
        code_expires_at: expiresAt,
      };
      

      const student = await createStudent(studentData);
      console.log(student)
      const token = createSecretToken(student.id, "student");
      console.log("Student:",student, "Token:",token)
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.cookie("user", JSON.stringify(student), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      try {
        await sendVerificationEmail(email, code);
        return res.status(201).json({
          status: true,
          message: "Verification code sent",
          token,
          user: student,
        });
      } catch (emailErr) {
        console.error("Email error (user still created):", emailErr);
        return res.status(201).json({
          status: true,
          message:
            "Account created! Check your email. If you don’t receive a code, contact support.",
          token,
          user: student,
        });
      }
    } catch (err) {
      console.error("Signup error:", err);
      return handleError(
        res,
        500,
        "Server error during signup",
        "REGISTRATION_ERROR"
      );
    }
  },
];

export const verifyCode = [
  body("email").isEmail().normalizeEmail().withMessage("Invalid email format"),
  body("code")
    .isLength({ min: 6, max: 6 })
    .withMessage("Verification code must be 6 digits"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleError(res, 400, errors.array()[0].msg, "VALIDATION_ERROR");
    }

    try {
      const { email, code } = req.body;
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
      return res.status(200).json({ status: true, message: "Email verified" });
    } catch (err) {
      console.error("Verification error:", err);
      return handleError(
        res,
        500,
        "Server error during email verification",
        "VERIFICATION_ERROR"
      );
    }
  },
];

export const login = [
  body("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Invalid email format"),
  body("phone")
    .optional()
    .isMobilePhone("any")
    .withMessage("Invalid phone number"),
  body("password").notEmpty().withMessage("Password is required"),
  body().custom((value, { req }) => {
    if (!req.body.email && !req.body.phone) {
      throw new Error("Email or phone number is required");
    }
    if (req.body.email && req.body.phone) {
      throw new Error("Provide either email or phone number, not both");
    }
    return true;
  }),


  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleError(res, 400, errors.array()[0].msg, "VALIDATION_ERROR");
    }

    try {
      const { email, phone, password } = req.body;
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

      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.cookie("user", JSON.stringify(safeStudent), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        status: true,
        message: "Login successful",
        token,
        user: safeStudent,
      });
    } catch (err) {
      console.error("Login error:", err);
      return handleError(res, 500, "Internal server error", "LOGIN_ERROR");
    }
  },
];

export const getStudentProfile = async (req, res) => {
  try {
    const student = req.student;

    if (!student) {
      return handleError(res, 404, "Student not found", "STUDENT_NOT_FOUND");
    }

    const { password, code, ...safeStudent } = student;
    return res.status(200).json({
      status: true,
      data: safeStudent,
    });
  } catch (err) {
    console.error("Profile route error:", err);
    return handleError(res, 500, "Failed to fetch profile", "PROFILE_ERROR");
  }
};

export const logout = async (req, res) => {
  try {
    console.log("Logout request received", req.cookies);
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    // res.clearCookie("user", {
    //   httpOnly: false,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    // });
    return res.status(200).json({ status: true, message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    return handleError(res, 500, "Server error during logout", "LOGOUT_ERROR");
  }
};
