import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import PasswordStrength from "../../context/PasswordStrength.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import PhoneNumberValidator from "../../context/PhoneNumberValidator.jsx";
import Cookies from "js-cookie";

const sanitizeInput = (input) => input.replace(/[<>]/g, "");

const validateDob = (dob) => {
  if (!dob) return "Date of birth is required.";
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age >= 5 ? "" : "You must be at least 5 years old.";
};

const StudentSignup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfPassFocused, setIsConfPassFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const {
    VITE_BACKEND_BASE_URL,
    setShowEmailVerification,
    setUser,
    setUserType,
    setShowSignup,
    setShouldFetchUser,
  } = useContext(AppContext);

  const navigate = useNavigate();

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return value.length < 2 ? "Name must be at least 2 characters." : "";
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value)
          ? "Please enter a valid email address."
          : "";
      case "phoneNumber":
        const phoneValidation = PhoneNumberValidator(value);
        return phoneValidation.isValid ? "" : phoneValidation.error;
      case "dateOfBirth":
        return validateDob(value);
      case "gender":
        return !value ? "Please select a gender." : "";
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
      case "name":
        setName(sanitizedValue);
        break;
      case "email":
        setEmail(sanitizedValue);
        break;
      case "phoneNumber":
        setPhoneNumber(sanitizedValue);
        break;
      case "dateOfBirth":
        setDateOfBirth(sanitizedValue);
        break;
      case "gender":
        setGender(sanitizedValue);
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

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhoneNumber("");
    setDateOfBirth("");
    setGender("");
    setPassword("");
    setConfirmPassword("");
    setErrors({
      name: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: "",
      gender: "",
      password: "",
      confirmPassword: "",
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const newErrors = {
      name: validateField("name", name),
      email: validateField("email", email),
      phoneNumber: validateField("phoneNumber", phoneNumber),
      dateOfBirth: validateField("dateOfBirth", dateOfBirth),
      gender: validateField("gender", gender),
      password: validateField("password", password),
      confirmPassword:
        password !== confirmPassword ? "Passwords do not match." : "",
    };

    if (Object.values(newErrors).some(Boolean)) {
      setErrors(newErrors);
      toast.error("Please fix form errors.");
      return;
    }

    const phoneValidation = PhoneNumberValidator(phoneNumber);
    if (!phoneValidation.isValid) {
      setErrors((prev) => ({ ...prev, phoneNumber: phoneValidation.error }));
      toast.error(phoneValidation.error);
      return;
    }

    setLoading(true);
    try {
      const dob = new Date(dateOfBirth);
      if (isNaN(dob.getTime())) {
        throw new Error("Invalid date of birth.");
      }

      const formData = {
        name,
        email,
        phoneNumber: phoneValidation.e164 || phoneNumber,
        dateOfBirth: dob.toISOString(),
        gender,
        password,
      };

      const response = await fetch(
        `${VITE_BACKEND_BASE_URL}/api/students/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Registration failed.");
      }

      Cookies.set("signupEmail", email, {
        expires: 1,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });
      Cookies.set("userType", "student", {
        expires: 1,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      toast.success("Registration successful! Please verify your email.");
      setUser(data.user);
      setUserType("student");
      setShowSignup(false);
      setShowEmailVerification(true);
      setShouldFetchUser(true);
      resetForm();
      localStorage.setItem("verify_email", data.user.email);
      localStorage.setItem("verify_user_type", "student");

      navigate("/verify");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 flex flex-col overflow-hidden lg:flex-row">
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
            className="w-full flex flex-col items-center max-h-[70vh] sm:max-h-[75vh] overflow-y-auto p-4 sm:p-6 rounded-2xl bg-white shadow-lg"
            onSubmit={onSubmitHandler}
            noValidate
          >
            {/* Name */}
            <div className="mb-4 w-full max-w-sm sm:max-w-md">
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <div
                className={`flex items-center gap-2 border-b-2 ${
                  errors.name ? "border-red-500" : "border-teal-600"
                } pb-2`}
              >
                <img
                  src={assets.username || "/fallback-icon.png"}
                  className="w-5 h-5 mx-2"
                  alt=""
                />
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm sm:text-base text-teal-600 font-medium placeholder:text-gray-400 focus:outline-none"
                  required
                  aria-required="true"
                  aria-invalid={errors.name ? "true" : "false"}
                  autoComplete="name"
                />
                <img
                  src={
                    errors.name
                      ? assets.crossTick || "/error-icon.png"
                      : assets.rightTick || "/tick-icon.png"
                  }
                  alt={errors.name ? "Error" : "Valid"}
                  className="w-5 h-5 mx-2"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1" role="alert">
                  {errors.name}
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
                  autoComplete="email"
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
                <p className="text-red-500 text-sm mt-1" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Contact */}
            <div className="mb-4 w-full max-w-sm sm:max-w-md">
              <label htmlFor="phoneNumber" className="sr-only">
                Contact
              </label>
              <div
                className={`flex items-center gap-2 border-b-2 ${
                  errors.phoneNumber ? "border-red-500" : "border-teal-600"
                } pb-2`}
              >
                <img
                  src={assets.phone || "/fallback-icon.png"}
                  className="w-5 h-5 mx-2"
                  alt=""
                />
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm sm:text-base text-teal-600 font-medium placeholder:text-gray-400 focus:outline-none"
                  required
                  aria-required="true"
                  aria-invalid={errors.phoneNumber ? "true" : "false"}
                />
                <img
                  src={
                    errors.phoneNumber
                      ? assets.crossTick || "/error-icon.png"
                      : assets.rightTick || "/tick-icon.png"
                  }
                  alt={errors.phoneNumber ? "Error" : "Valid"}
                  className="w-5 h-5 mx-2"
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1" role="alert">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="mb-4 w-full max-w-sm sm:max-w-md">
              <label htmlFor="dateOfBirth" className="sr-only">
                Date of Birth
              </label>
              <div
                className={`flex items-center gap-2 border-b-2 ${
                  errors.dateOfBirth ? "border-red-500" : "border-teal-600"
                } pb-2`}
              >
                <img
                  src={assets.calender || "/fallback-icon.png"}
                  className="w-5 h-5 mx-2"
                  alt=""
                />
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  placeholder="Date of Birth"
                  value={dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm sm:text-base text-teal-600 font-medium placeholder:text-gray-400 focus:outline-none"
                  required
                  aria-required="true"
                  aria-invalid={errors.dateOfBirth ? "true" : "false"}
                />
                <img
                  src={
                    errors.dateOfBirth
                      ? assets.crossTick || "/error-icon.png"
                      : assets.rightTick || "/tick-icon.png"
                  }
                  alt={errors.dateOfBirth ? "Error" : "Valid"}
                  className="w-5 h-5 mx-2"
                />
              </div>
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm mt-1" role="alert">
                  {errors.dateOfBirth}
                </p>
              )}
            </div>

            {/* Gender */}
            <div className="mb-4 w-full max-w-sm sm:max-w-md">
              <fieldset
                className={`border-b-2 ${
                  errors.gender ? "border-red-500" : "border-teal-600"
                } pb-2`}
              >
                <legend className="sr-only">Gender</legend>
                <div className="flex items-start gap-2">
                  <img
                    src={assets.user || "/fallback-icon.png"}
                    className="w-5 h-5 mx-2 mt-2"
                    alt=""
                  />
                  <h3 className="text-sm sm:text-base font-medium text-gray-900 mt-2">
                    Gender
                  </h3>
                  <div className="w-full flex flex-wrap gap-4 sm:gap-6 px-3 py-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={gender === "Male"}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                        aria-invalid={errors.gender ? "true" : "false"}
                      />
                      <span className="text-gray-700 text-sm">Male</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={gender === "Female"}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                        aria-invalid={errors.gender ? "true" : "false"}
                      />
                      <span className="text-gray-700 text-sm">Female</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="gender"
                        value="Prefer not to say"
                        checked={gender === "Prefer not to say"}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                        aria-invalid={errors.gender ? "true" : "false"}
                      />
                      <span className="text-gray-700 text-sm">
                        Prefer not to say
                      </span>
                    </label>
                  </div>
                </div>
              </fieldset>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1" role="alert">
                  {errors.gender}
                </p>
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
                <p className="text-red-500 text-sm mt-1" role="alert">
                  {errors.password}
                </p>
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
                <p className="text-red-500 text-sm mt-1" role="alert">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-36 sm:w-40 px-4 py-2.5 text-sm sm:text-base text-white font-semibold bg-[#1F4C56]  rounded-full mt-4 disabled:bg-[#2D7B67]"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing up...
                </span>
              ) : (
                "Sign Up"
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
              src={assets.signup_illustration || "/fallback-illustration.png"}
              alt="Signup illustration"
              className="relative w-full h-auto max-h-[70vh] object-contain z-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSignup;
