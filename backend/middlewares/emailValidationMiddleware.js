import blockedDomains from "../config/blockedDomains.js";
import { isValidEmailDomain } from "../utils/emailValidator.js";
import { handleError } from "../utils/errorHandler.js";
import { body, validationResult } from "express-validator";
import dotenv from "dotenv";

dotenv.config();

const validateEmailDomain = [
  body("email").isEmail().normalizeEmail().withMessage("Invalid email format"),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleError(res, 400, errors.array()[0].msg, "VALIDATION_ERROR");
    }

    try {
      const { email } = req.body;
      const domain = email.split("@")[1];

      if (blockedDomains.includes(domain.toLowerCase())) {
        return handleError(
          res,
          400,
          "Dummy or test email domains are not allowed",
          "BLOCKED_DOMAIN"
        );
      }

      const isValid = await isValidEmailDomain(domain);
      if (!isValid) {
        return handleError(
          res,
          400,
          "Email domain cannot receive emails (no MX records found)",
          "INVALID_MX_RECORD"
        );
      }

      next();
    } catch (error) {
      console.error("Email validation error:", error);
      return handleError(
        res,
        500,
        "Server error during email validation",
        "VALIDATION_ERROR"
      );
    }
  },
];

export { validateEmailDomain };
