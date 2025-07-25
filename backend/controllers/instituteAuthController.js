import bcrypt from "bcrypt";
import { createSecretToken } from "../config/jwt.js";
import sendVerificationEmail from "../utils/emailSender.js";
import {
  createInstitute,
  updateInstituteSection,
  findInstituteByEmail,
  findInstituteByPhone,
  verifyInstitute,
  findInstituteById,
  getAllInstitutes,
} from "../models/instituteModel.js";
import { handleError } from "../utils/errorHandler.js";
import { body, param, validationResult } from "express-validator";

// Signup a new institute
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

      const existingEmail = await findInstituteByEmail(email);
      if (existingEmail) {
        return handleError(res, 400, "Email already exists", "EMAIL_EXISTS");
      }

      const existingPhone = await findInstituteByPhone(contact);
      if (existingPhone) {
        return handleError(
          res,
          400,
          "Phone number already exists",
          "PHONE_EXISTS"
        );
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
      console.log("Signup - Insitute:", institute, "Token:", token); // Debug

      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      try {
        await sendVerificationEmail(email, code);
        return res.status(201).json({
          status: true,
          message: "Verification code sent",
          token,
          user: { id: institute.id, institute_name, email },
        });
      } catch (emailErr) {
        console.error("Email error (user still created):", emailErr);
        return res.status(201).json({
          status: true,
          message:
            "Account created! Check your email. If you don’t receive a code, contact support.",
          token,
          user: { id: institute.id, institute_name, email },
        });
      }
    } catch (err) {
      console.error("Signup error:", err, err.stack);
      return handleError(
        res,
        500,
        "Server error during registration",
        "REGISTRATION_ERROR"
      );
    }
  },
];

// Verify the institute's email with the code sent to their email
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

      const updatedInstitute = await verifyInstitute(email);
      const token = createSecretToken(updatedInstitute.id, "institute");

      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        status: true,
        message: "Email verified",
        user: {
          id: updatedInstitute.id,
          institute_name: updatedInstitute.institute_name,
          email: updatedInstitute.email,
        },
      });
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

// Resend verification code to the institute's email
export const resendVerificationCode = [
  body("email").isEmail().normalizeEmail().withMessage("Invalid email format"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("DEBUG: Resend validation error:", errors.array());
      return handleError(res, 400, errors.array()[0].msg, "VALIDATION_ERROR");
    }

    try {
      const { email } = req.body;
      console.log("DEBUG: Resending verification code for:", email);

      const institute = await findInstituteByEmail(email);
      if (!institute) {
        console.log("DEBUG: Institute not found for email:", email);
        return handleError(
          res,
          404,
          "Institute not found",
          "INSTITUTE_NOT_FOUND"
        );
      }

      if (institute.is_verified) {
        console.log("DEBUG: Email already verified for:", email);
        return handleError(
          res,
          400,
          "Email already verified",
          "ALREADY_VERIFIED"
        );
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await updateInstituteSection(institute.id, "code", code);
      await updateInstituteSection(institute.id, "code_expires_at", expiresAt);

      console.log("DEBUG: Generated new code:", code, "Expires at:", expiresAt);

      try {
        await sendVerificationEmail(email, code);
        console.log("DEBUG: Verification email sent to:", email);
        return res.status(200).json({
          status: true,
          message: "Verification code resent",
        });
      } catch (emailErr) {
        console.error("DEBUG: Email sending error:", emailErr);
        return handleError(res, 500, "Failed to send email", "EMAIL_ERROR");
      }
    } catch (err) {
      console.error("DEBUG: Resend error:", err);
      return handleError(res, 500, "Server error", "RESEND_ERROR");
    }
  },
];

// Login an institute
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
        secure: true,
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.cookie("user", JSON.stringify(safeInstitute), {
        httpOnly: true,
        secure: true,
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
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
  // Validate section parameter to match model's validSections
  param("section")
    .isIn([
      "basic-info",
      "contact",
      "courses",
      "faculties",
      "student-achievements",
      "institute-achievements",
      "facilities",
      "social-media",
      "media",
    ])
    .withMessage("Invalid section"),

  // Ensure body is not empty
  body().notEmpty().withMessage("Data is required"),

  // Section-specific validations
  body().custom((value, { req }) => {
    const { section } = req.params;
    console.log("REQ BODY:", JSON.stringify(req.body, null, 2));
    console.log("REQ PARAMS:", req.params);

    if (section === "basic-info") {
      if (!value.institute_name) {
        throw new Error("Institute name is required");

      }
    }

    if (section === "media") {
      if (
        typeof value !== "object" ||
        !Array.isArray(value.classroomImages) ||
        !Array.isArray(value.demoVideos) ||
        !Array.isArray(value.tourVideos)
      ) {
        throw new Error(
          "Media must include classroomImages, demoVideos, and tourVideos as arrays"
        );
      }
    }

    return true;
  }),

  // Controller logic
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("🔴 VALIDATION ERRORS:", errors.array());
      return handleError(res, 400, errors.array()[0].msg, "VALIDATION_ERROR");
    }

    try {
      const { section } = req.params;
      const data = req.body;
      const instituteId = req.institute?.id;

      if (!instituteId) {
        return handleError(
          res,
          401,
          "Unauthorized: Institute ID missing",
          "AUTH_ERROR"
        );
      }

      const sectionMap = {
        "basic-info": "basic_info",
        contact: "contact_details",
        courses: "courses",
        faculties: "faculty_details",
        "student-achievements": "student_achievements",
        "institute-achievements": "institute_achievements",
        facilities: "facilities",
        "social-media": "social_media",
        media: "media_gallery",
      };

      const column = sectionMap[section];

      console.log(
        `DEBUG: Updating section "${section}" for instituteId: ${instituteId}`
      );
      console.log("Payload:", data);

      const institute = await updateInstituteSection(
        instituteId,
        column,
        JSON.stringify(data)
      );

      if (!institute) {
        return handleError(
          res,
          404,
          "Institute not found",
          "INSTITUTE_NOT_FOUND"
        );
      }

      // Remove sensitive fields
      const { password, code, ...safeInstitute } = institute;

      return res.status(200).json({
        status: true,
        data: safeInstitute,
        message: `${section} saved successfully`,
      });
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
      secure: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
    });
    res.clearCookie("user", {
      httpOnly: true,
      secure: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
    });
    return res.status(200).json({ status: true, message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    return handleError(res, 500, "Server error during logout", "LOGOUT_ERROR");
  }
};

// Fetch all institutes (excluding sensitive fields)
export const getAllInstitutesData = async (req, res) => {
  try {
    const institutes = await getAllInstitutes();
    const safeInstitutes = institutes.map(
      ({ password, code, ...rest }) => rest
    );

    return res.status(200).json({ status: true, data: safeInstitutes });
  } catch (err) {
    console.error("Get all institutes error:", err);
    return handleError(
      res,
      500,
      "Failed to fetch institutes",
      "INSTITUTES_FETCH_ERROR"
    );
  }
};


// Fetch institute by ID
export const getInstituteById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching institute by ID:", id);

    // Validate ID format
    if (!id) {
      return handleError(res, 400, "Invalid institute ID", "INVALID_ID");
    }

    const institute = await findInstituteById(id);
    if (!institute) {
      return handleError(
        res,
        404,
        "Institute not found",
        "INSTITUTE_NOT_FOUND"
      );
    }

    // Remove sensitive fields
    const { password, code, ...safeInstitute } = institute;
    return res.status(200).json({ status: true, data: safeInstitute });
  } catch (err) {
    console.error("Get institute by ID error:", err);
    return handleError(res, 500, "Internal server error", "INSTITUTE_ERROR");
  }
};

