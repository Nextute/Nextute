import { parsePhoneNumberFromString } from "libphonenumber-js";

// Preprocess phone number to remove extra spaces, hyphens, or dots
const cleanPhoneNumber = (phone) => phone.replace(/[\s.-]/g, "");

// Phone number validator
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
          "Invalid phone number format. Please enter a 10-digit number or include country code (e.g., +91).",
      };
    }
    if (!phoneNumber.isValid()) {
      return {
        isValid: false,
        error:
          "Invalid phone number for the region. Ensure it matches the country format.",
      };
    }
    return { isValid: true, formatted: phoneNumber.formatInternational() };
  } catch (error) {
    return {
      isValid: false,
      error: "Error parsing phone number. Please check your input.",
    };
  }
};

export default PhoneNumberValidator;
