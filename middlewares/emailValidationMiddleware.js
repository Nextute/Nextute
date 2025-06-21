import blockedDomains from "../config/blockedDomains.js";
import { isValidEmailDomain } from "../utils/emailValidator.js";
import { handleError } from "../utils/errorHandler.js";

const validateEmailDomain = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return handleError(res, 400, "Email is required", "MISSING_EMAIL");
    }

    const domain = email.split("@")[1];
    if (!domain) {
      return handleError(
        res,
        400,
        "Invalid email format",
        "INVALID_EMAIL_FORMAT"
      );
    }

    // Check if domain is in the blacklist
    if (blockedDomains.includes(domain.toLowerCase())) {
      return handleError(
        res,
        400,
        "Dummy or test email domains are not allowed",
        "BLOCKED_DOMAIN"
      );
    }

    // Verify domain has valid MX records
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
    handleError(
      res,
      500,
      "Server error during email validation",
      "VALIDATION_ERROR"
    );
  }
};

export { validateEmailDomain };
