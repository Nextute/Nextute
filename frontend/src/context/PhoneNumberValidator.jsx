import { parsePhoneNumberFromString } from "libphonenumber-js";

// Remove spaces, dashes, and dots
const cleanPhoneNumber = (phone) => {
  if (!phone || typeof phone !== "string") return "";
  return phone.replace(/[\s.-]/g, "");
};

const PhoneNumberValidator = (phone, defaultCountry = "IN") => {
  try {
    const cleanedPhone = cleanPhoneNumber(phone);
    const phoneNumber = parsePhoneNumberFromString(
      cleanedPhone,
      defaultCountry
    );

    if (!phoneNumber) {
      return {
        isValid: false,
        error:
          "Invalid phone number. Please enter a valid 10-digit number or include a country code like +91.",
      };
    }

    if (!phoneNumber.isValid()) {
      return {
        isValid: false,
        error:
          "Invalid phone number for the region. Ensure it matches the correct format.",
      };
    }

    return {
      isValid: true,
      formatted: phoneNumber.formatInternational(), // e.g., "+91 98765 43210"
      e164: phoneNumber.number || cleanedPhone, // e.g., "+919876543210" ✅ safe fallback
    };
  } catch (err) {
    return {
      isValid: false,
      error: "Unable to parse the phone number. Please check your input.",
    };
  }
};

export default PhoneNumberValidator;
