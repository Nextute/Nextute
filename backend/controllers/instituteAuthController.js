import { createSecretToken } from "../config/jwt.js";
import pool from "../db/index.js";
import bcrypt from "bcrypt";
import sendVerificationEmail from "../utils/emailSender.js";
import {
  createInstitute,
  updateInstituteSection,
  findInstituteByEmail,
  findInstituteByPhone,
  verifyInstitute,
  isInstituteIdUnique,
} from "../models/instituteModel.js";
import { handleError } from "../utils/errorHandler.js";

export const signup = async (req, res) => {
  try {
    const { institute_name, email, password, contact } = req.body;
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const existing = await findInstituteByEmail(email);
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

    let institute_id;
    let isUnique = false;
    const maxAttempts = 10;
    let attempts = 0;

    while (!isUnique && attempts < maxAttempts) {
      const randomPart = generateRandomString(6);
      institute_id = `NXI_${randomPart}`;
      isUnique = await isInstituteIdUnique(institute_id);
      attempts++;
      if (attempts === maxAttempts && !isUnique) {
        throw new Error(
          "Could not generate unique institute ID after multiple attempts"
        );
      }
    }

    const instituteData = {
      institute_id,
      institute_name,
      email,
      password: hashedPassword,
      contact,
      code,
      code_expires_at: expiresAt,
    };

    const institute = await createInstitute(instituteData);

    const token = createSecretToken(institute.id, "institute");

    // Set cookies
    res.cookie("authToken", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.cookie("user", JSON.stringify(institute), {
      maxAge: 7 * 24 * 60 * 60 * 1000,
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
        .json({ message: "Verification code sent", token, user: institute });
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
      err.message || "Server error during registration",
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

    let institute;

    if (email) {
      institute = await findInstituteByEmail(email);
    } else if (phone) {
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

    // Set cookies
    res.cookie("authToken", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
    });

    res.cookie("user", JSON.stringify(safeInstitute), {
      maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
    });

    res.status(201).json({
      message: "Login successful",
      token,
      user: safeInstitute,
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

export const updateInstituteLogo = async (id, logoUrl) => {
  try {
    const { rows } = await pool.query(
      "UPDATE institutes SET logo_url = $1 WHERE id = $2 RETURNING *",
      [logoUrl, id]
    );
    if (rows.length === 0) {
      throw new Error("Institute not found");
    }
    return rows[0];
  } catch (err) {
    throw new Error(err.message || "Server error during logo update");
  }
};

export const updateProfileSection = async (req, res) => {
  try {
    const { section } = req.params;
    const data = req.body;

    if (!section || !data) {
      return handleError(
        res,
        400,
        "Section and data are required",
        "MISSING_FIELDS"
      );
    }

    const updatedInstitute = await updateInstituteSection(
      req.institute.id,
      section,
      JSON.stringify(data)
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
    res.status(200).json(safeInstitute);
  } catch (err) {
    handleError(
      res,
      500,
      err.message || "Server error during profile update",
      "PROFILE_UPDATE_ERROR"
    );
  }
};

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
    res.status(200).json(safeInstitute);
  } catch (err) {
    console.error("Get profile error:", err);
    handleError(res, 500, "Internal server error", "PROFILE_ERROR");
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
