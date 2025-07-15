import { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import PasswordStrength from "../../context/PasswordStrength";
import { AppContext } from "../../context/AppContext";
import PhoneNumberValidator from "../../context/PhoneNumberValidator.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Sanitize input to prevent XSS
const sanitizeInput = (input) => {
  return input.replace(/[<>]/g, "");
};

const InstituteSignup = () => {
  const [institute_name, setInstituteName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfPassFocused, setIsConfPassFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    institute_name: "",
    email: "",
    contact: "",
    password: "",
  });

  const navigate = useNavigate();
  const {
    VITE_BACKEND_BASE_URL,
    setShowEmailVerification,
    setUser,
    setUserType,
    setShowSignup,
    setShouldFetchUser,
  } = useContext(AppContext);

  // Real-time validation
  const validateField = (name, value) => {
    switch (name) {
      case "institute_name":
        return value.length < 2
          ? "Institute name must be at least 2 characters."
          : "";
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value)
          ? "Please enter a valid email address."
          : "";
      case "contact":
        const phoneValidation = PhoneNumberValidator(value);
        return phoneValidation.isValid ? "" : phoneValidation.error;
      case "password":
        return value.length < 8
          ? "Password must be at least 8 characters."
          : "";
      default:
        return "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    switch (name) {
      case "institute_name":
        setInstituteName(sanitizedValue);
        break;
      case "email":
        setEmail(sanitizedValue);
        break;
      case "contact":
        setContact(sanitizedValue);
        break;
      case "password":
        setPassword(sanitizedValue);
        break;
      case "confirmPassword":
        setConfirmPassword(sanitizedValue);
        break;
      default:
        break;
    }
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, sanitizedValue),
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    console.log("DEBUG: Starting signup submission");
    console.log("DEBUG: Form data:", {
      institute_name,
      email,
      contact,
      password,
    });

    const newErrors = {
      institute_name: validateField("institute_name", institute_name),
      email: validateField("email", email),
      contact: validateField("contact", contact),
      password: validateField("password", password),
      confirmPassword: validateField(
        "confirmPassword",
        confirmPassword,
        password
      ),
    };

    console.log("DEBUG: Validation errors:", newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      toast.error("Please fix the errors in the form.");
      console.log("DEBUG: Form validation failed");
      return;
    }

    if (password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match.",
      }));
      console.log("DEBUG: Passwords do not match");
      return;
    }

    if (contact) {
      const phoneValidation = PhoneNumberValidator(contact);
      console.log("DEBUG: Phone validation:", phoneValidation);
      if (!phoneValidation.isValid) {
        setErrors((prev) => ({ ...prev, contact: phoneValidation.error }));
        console.log("DEBUG: Phone validation failed");
        return;
      }
    }

    setLoading(true);
    console.log("DEBUG: Sending signup request");
    try {
      const formData = {
        institute_name,
        email,
        contact,
        password,
      };

      const response = await axios.post(
        `${VITE_BACKEND_BASE_URL}/api/institutes/signup`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Send cookies
        }
      );

      console.log("DEBUG: Signup response:", response.data);

      if (response.status === 201) {
        const userData = response.data?.user || {}; // get user if backend sends it
        toast.success("Registration successful! Please verify your email.");

        // Context updates for navbar
        setUser(userData);
        setUserType("institute");
        setShouldFetchUser(true);
        setShowSignup(false);
        setShowEmailVerification(true);
        localStorage.setItem("verify_email", data.user.email);
        localStorage.setItem("verify_user_type", "institute");

        navigate("/verify", { state: { email, userType: "institute" } });
      } else {
        console.error("DEBUG: Signup failed:", response.data.message);
        toast.error(response.data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("DEBUG: Signup error:", error.response?.data || error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again later."
      );
    } finally {
      setLoading(false);
      console.log("DEBUG: Signup request completed");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden lg:flex-row">
      {/* Logo */}
      <div className="px-4 sm:px-6 lg:px-10 z-30">
        <img
          src={assets.logo || "/fallback-logo.png"}
          alt="Logo"
          className="w-24 sm:w-28 md:w-32 lg:w-36 absolute top-0 lg:-top-4 left-4 sm:left-6 lg:left-8"
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row items-center justify-center w-full min-h-screen p-4 sm:p-6 lg:p-10">
        {/* Right Form Section */}
        <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto lg:mx-0 lg:mr-8 xl:mr-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-10 sm:mb-8 lg:mb-4">
            Sign Up
          </h2>

          <form
            className="w-full flex flex-col items-center max-h-[70vh] sm:max-h-[75vh] overflow-y-auto p-4 sm:p-6"
            onSubmit={onSubmitHandler}
            noValidate
          >
            {/* Institute Name */}
            <div className="mb-4 w-full max-w-sm sm:max-w-md">
              <label htmlFor="institute_name" className="sr-only">
                Institute Name
              </label>
              <div
                className={`flex items-center gap-2 border-b-2 ${
                  errors.institute_name ? "border-red-500" : "border-teal-600"
                } pb-2`}
              >
                <img src={assets.username} className="w-5 h-5 mx-2" alt="" />
                <input
                  id="institute_name"
                  name="institute_name"
                  type="text"
                  placeholder="Institute Name"
                  value={institute_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm sm:text-base text-teal-600 font-medium placeholder:text-gray-400 focus:outline-none"
                  required
                  aria-required="true"
                  aria-invalid={errors.institute_name ? "true" : "false"}
                  autoComplete="institute_name"
                />
                <img
                  src={
                    errors.institute_name
                      ? assets.crossTick || "/error-icon.png"
                      : assets.rightTick || "/tick-icon.png"
                  }
                  alt={errors.institute_name ? "Error" : "Valid"}
                  className="w-5 h-5 mx-2"
                />
              </div>
              {errors.institute_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.institute_name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4 w-full max-w-sm sm:max-w-md">
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <div
                className={`flex items-center gap-2 border-b-2 ${
                  errors.email ? "border-red-500" : "border-teal-600"
                } pb-2`}
              >
                <img
                  src={assets.email || "/fallback-icon.png"}
                  className="w-5 h-5 mx-2"
                  alt=""
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm sm:text-base text-teal-600 font-medium placeholder:text-gray-400 focus:outline-none"
                  required
                  aria-required="true"
                  aria-invalid={errors.email ? "true" : "false"}
                />
                <img
                  src={
                    errors.email
                      ? assets.crossTick || "/error-icon.png"
                      : assets.rightTick || "/tick-icon.png"
                  }
                  alt={errors.email ? "Error" : "Valid"}
                  className="w-5 h-5 mx-2"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Contact */}
            <div className="mb-4 w-full max-w-sm sm:max-w-md">
              <label htmlFor="contact" className="sr-only">
                Contact
              </label>
              <div
                className={`flex items-center gap-2 border-b-2 ${
                  errors.contact ? "border-red-500" : "border-teal-600"
                } pb-2`}
              >
                <img
                  src={assets.contact || "/fallback-icon.png"}
                  className="w-5 h-5 mx-2"
                  alt=""
                />
                <input
                  id="contact"
                  name="contact"
                  type="tel"
                  placeholder="Contact"
                  value={contact}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm sm:text-base text-teal-600 font-medium placeholder:text-gray-400 focus:outline-none"
                  required
                  aria-required="true"
                  aria-invalid={errors.contact ? "true" : "false"}
                />
                <img
                  src={
                    errors.contact
                      ? assets.crossTick || "/error-icon.png"
                      : assets.rightTick || "/tick-icon.png"
                  }
                  alt={errors.contact ? "Error" : "Valid"}
                  className="w-5 h-5 mx-2"
                />
              </div>
              {errors.contact && (
                <p className="text-red-500 text-sm mt-1">{errors.contact}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-4 w-full max-w-sm sm:max-w-md">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div
                className={`flex items-center gap-2 border-b-2 ${
                  errors.password ? "border-red-500" : "border-teal-600"
                } pb-2`}
              >
                <img
                  src={assets.lock || "/fallback-icon.png"}
                  className="w-5 h-5 mx-2"
                  alt=""
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={handleInputChange}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  className="w-full px-3 py-2 text-sm sm:text-base text-teal-600 font-medium placeholder:text-gray-400 focus:outline-none"
                  required
                  aria-required="true"
                  aria-invalid={errors.password ? "true" : "false"}
                />
                {isPasswordFocused && (
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setShowPassword((prev) => !prev);
                    }}
                    className="text-teal-700 mx-2"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                )}
                <img
                  src={
                    errors.password
                      ? assets.crossTick || "/error-icon.png"
                      : assets.rightTick || "/tick-icon.png"
                  }
                  alt={errors.password ? "Error" : "Valid"}
                  className="w-5 h-5 mx-2"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
              {password && isPasswordFocused && (
                <PasswordStrength password={password} />
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-4 w-full max-w-sm sm:max-w-md">
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <div
                className={`flex items-center gap-2 border-b-2 ${
                  errors.confirmPassword ? "border-red-500" : "border-teal-600"
                } pb-2`}
              >
                <img
                  src={assets.lock || "/fallback-icon.png"}
                  className="w-5 h-5 mx-2"
                  alt=""
                />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfPassword ? "text" : "password"}
                  placeholder="Re-type Password"
                  value={confirmPassword}
                  onChange={handleInputChange}
                  onFocus={() => setIsConfPassFocused(true)}
                  onBlur={() => setIsConfPassFocused(false)}
                  className="w-full px-3 py-2 text-sm sm:text-base text-teal-600 font-medium placeholder:text-gray-400 focus:outline-none"
                  required
                  aria-required="true"
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                />
                {isConfPassFocused && (
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setShowConfPassword((prev) => !prev);
                    }}
                    className="text-teal-700 mx-2"
                    aria-label={
                      showConfPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                )}
                <img
                  src={
                    errors.confirmPassword
                      ? assets.crossTick || "/error-icon.png"
                      : assets.rightTick || "/tick-icon.png"
                  }
                  alt={errors.confirmPassword ? "Error" : "Valid"}
                  className="w-5 h-5 mx-2"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-48 sm:w-52 px-4 py-3 text-sm sm:text-base text-white font-semibold bg-[#1F4C56] rounded-full mt-4 disabled:bg-[#2D7B67]"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Registering...
                </span>
              ) : (
                "Continue Registration"
              )}
            </button>
          </form>
        </div>

        {/* Left Illustration Section */}
        <div className="hidden lg:block w-full max-w-md xl:max-w-lg mx-auto lg:mx-0">
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="578"
              height="833"
              viewBox="0 0 578 833"
              fill="none"
              className="absolute bottom-[80%] left-[70%] w-full max-h-[60vh] z-20 rotate-[30deg]"
            >
              <path
                d="M38.1068 49.801C39.6788 21.1252 64.1994 -0.84673 92.8752 0.725277L804.635 39.744C832.897 41.2933 854.729 65.1624 853.758 93.4501L830.109 782.346C829.104 811.624 804.122 834.294 774.883 832.459L49.3638 786.943C20.8611 785.155 -0.865621 760.715 0.697627 732.199L38.1068 49.801Z"
                fill="#AAD294"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="578"
              height="833"
              viewBox="0 0 578 833"
              fill="none"
              className="absolute bottom-[45%] left-[5%] w-full max-h-[80vh] z-10 -rotate-[33deg]"
            >
              <path
                d="M38.1068 49.801C39.6788 21.1252 64.1994 -0.84673 92.8752 0.725277L804.635 39.744C832.897 41.2933 854.729 65.1624 853.758 93.4501L830.109 782.346C829.104 811.624 804.122 834.294 774.883 832.459L49.3638 786.943C20.8611 785.155 -0.865621 760.715 0.697627 732.199L38.1068 49.801Z"
                fill="#1F4C56"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="578"
              height="833"
              viewBox="0 0 578 833"
              fill="none"
              className="absolute bottom-1 left-[35%] w-full max-h-[80vh] z-10 -rotate-[12deg]"
            >
              <path
                d="M38.1068 49.801C39.6788 21.1252 64.1994 -0.84673 92.8752 0.725277L804.635 39.744C832.897 41.2933 854.729 65.1624 853.758 93.4501L830.109 782.346C829.104 811.624 804.122 834.294 774.883 832.459L49.3638 786.943C20.8611 785.155 -0.865621 760.715 0.697627 732.199L38.1068 49.801Z"
                fill="#1F4C56"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="578"
              height="833"
              viewBox="0 0 578 833"
              fill="none"
              className="absolute top-40 left-[32%] w-full max-h-[80vh] z-0 rotate-3"
            >
              <path
                d="M38.1068 49.801C39.6788 21.1252 64.1994 -0.84673 92.8752 0.725277L804.635 39.744C832.897 41.2933 854.729 65.1624 853.758 93.4501L830.109 782.346C829.104 811.624 804.122 834.294 774.883 832.459L49.3638 786.943C20.8611 785.155 -0.865621 760.715 0.697627 732.199L38.1068 49.801Z"
                fill="#2D7B67"
              />
            </svg>
            <img
              src={assets.institue_illustration}
              alt="Signup illustration"
              className="relative w-full h-auto max-h-[70vh] object-contain z-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstituteSignup;
