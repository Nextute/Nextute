import bcrypt from "bcrypt";
import { createSecretToken } from "../config/jwt.js";
import sendVerificationEmail from "../utils/emailSender.js";
import {
  createInstitute,
  updateInstituteSection,
  findInstituteByEmail,
  findInstituteByPhone,
  verifyInstitute,
} from "../models/instituteModel.js";
import { handleError } from "../utils/errorHandler.js";
import { body, param, validationResult } from "express-validator";

export const signup = [
  body("institute_name")
    .trim()
    .notEmpty()
    .withMessage("Institute name is required"),
  body("email").isEmail().normalizeEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("contact")
    .optional()
    .isMobilePhone("any")
    .withMessage("Invalid phone number"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleError(res, 400, errors.array()[0].msg, "VALIDATION_ERROR");
    }

    try {
      const { institute_name, email, password, contact } = req.body;
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      const existing = await findInstituteByEmail(email);
      if (existing) {
        return handleError(res, 400, "Email already exists", "EMAIL_EXISTS");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      const instituteData = {
        institute_name,
        email,
        password: hashedPassword,
        contact,
        code,
        code_expires_at: expiresAt,
      };

      const institute = await createInstitute(instituteData);
      const token = createSecretToken(institute.id, "institute");

      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.cookie("user", JSON.stringify(institute), {
        httpOnly: false,
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
          user: institute,
        });
      } catch (emailErr) {
        console.error("Email error (user still created):", emailErr);
        return res.status(201).json({
          status: true,
          message:
            "Account created! Check your email. If you don’t receive a code, contact support.",
          token,
          user: institute,
        });
      }
    } catch (err) {
      console.error("Signup error:", err);
      return handleError(
        res,
        500,
        "Server error during registration",
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
      const institute = await findInstituteByEmail(email);
      const now = new Date();

      if (
        !institute ||
        institute.code !== code ||
        new Date(institute.code_expires_at) < now
      ) {
        return handleError(
          res,
          400,
          "Invalid or expired verification code",
          "INVALID_CODE"
        );
      }

      await verifyInstitute(email);
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
      let institute;

      if (email) {
        institute = await findInstituteByEmail(email);
      } else {
        institute = await findInstituteByPhone(phone);
      }

      if (!institute) {
        return handleError(
          res,
          404,
          "Institute not found",
          "INSTITUTE_NOT_FOUND"
        );
      }

      const isMatch = await bcrypt.compare(password, institute.password);
      if (!isMatch) {
        return handleError(
          res,
          401,
          "Invalid credentials",
          "INVALID_CREDENTIALS"
        );
      }

      const { password: _, code, ...safeInstitute } = institute;
      const token = createSecretToken(institute.id, "institute");

      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.cookie("user", JSON.stringify(safeInstitute), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        status: true,
        message: "Login successful",
        token,
        user: safeInstitute,
      });
    } catch (err) {
      console.error("Login error:", err);
      return handleError(res, 500, "Internal server error", "LOGIN_ERROR");
    }
  },
];

export const updateProfileSection = [
  param("section")
    .isIn([
      "basic-info",
      "contact",
      "faculties",
      "social-media",
      "student-achievements",
      "institute-achievements",
      "media",
    ])
    .withMessage("Invalid section"),
  body().notEmpty().withMessage("Data is required"),
  body("media")
    .optional()
    .isArray()
    .withMessage("Media must be an array")
    .custom((value) => {
      if (value) {
        return value.every((item) => item.classroomPhoto && item.demoVideo);
      }
      return true;
    })
    .withMessage("Each media set must include classroomPhoto and demoVideo"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleError(res, 400, errors.array()[0].msg, "VALIDATION_ERROR");
    }

    try {
      const { section } = req.params;
      const data = req.body;

      const sectionMap = {
        "basic-info": "basic_info",
        contact: "contact_details",
        faculties: "faculty_details",
        "social-media": "social_media",
        "student-achievements": "student_achievements",
        "institute-achievements": "institute_achievements",
        media: "media_gallery",
      };

      const column = sectionMap[section];
      const jsonData = JSON.stringify(data);

      const updatedInstitute = await updateInstituteSection(
        req.institute.id,
        column,
        jsonData
      );

      if (!updatedInstitute) {
        return handleError(
          res,
          404,
          "Institute not found",
          "INSTITUTE_NOT_FOUND"
        );
      }

      const { password, code, ...safeInstitute } = updatedInstitute;
      return res.status(200).json({ status: true, data: safeInstitute });
    } catch (err) {
      console.error("Profile update error:", err);
      return handleError(
        res,
        500,
        "Server error during profile update",
        "PROFILE_UPDATE_ERROR"
      );
    }
  },
];

export const getInstituteProfile = async (req, res) => {
  try {
    const institute = req.institute;

    if (!institute) {
      return handleError(
        res,
        404,
        "Institute not found",
        "INSTITUTE_NOT_FOUND"
      );
    }

    const { password, code, ...safeInstitute } = institute;
    return res.status(200).json({ status: true, data: safeInstitute });
  } catch (err) {
    console.error("Get profile error:", err);
    return handleError(res, 500, "Internal server error", "PROFILE_ERROR");
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.clearCookie("user", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.status(200).json({ status: true, message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    return handleError(res, 500, "Server error during logout", "LOGOUT_ERROR");
  }
};
