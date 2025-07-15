import { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { BiSolidUserRectangle } from "react-icons/bi";
import { RiLock2Fill } from "react-icons/ri";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const sanitizeInput = (input) => input.replace(/[<>]/g, "");
const cleanPhoneNumber = (phone) => phone.replace(/[\s.-]/g, "");

const validateInput = (input, defaultCountry = "IN") => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(input)) {
    return { type: "email", isValid: true, error: "" };
  }
  try {
    const cleanedPhone = cleanPhoneNumber(input);
    const phoneNumber = parsePhoneNumberFromString(
      cleanedPhone,
      defaultCountry
    );
    if (phoneNumber && phoneNumber.isValid()) {
      return {
        type: "phone",
        isValid: true,
        formatted: phoneNumber.formatInternational(),
        error: "",
      };
    }
    return {
      type: "phone",
      isValid: false,
      error:
        "Invalid phone number format. Please enter a valid 10-digit number.",
    };
  } catch {
    return {
      type: "phone",
      isValid: false,
      error: "Error validating phone number. Please check your input.",
    };
  }
};

const StudentLogin = () => {
  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ loginInput: "", password: "" });

  const {
    VITE_BACKEND_BASE_URL,
    setUser,
    setUserType,
    setShouldFetchUser,
    setShowLogin,
  } = useContext(AppContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    if (name === "loginInput") {
      setLoginInput(sanitizedValue);
      const validation = validateInput(sanitizedValue);
      setErrors((prev) => ({ ...prev, loginInput: validation.error }));
    } else if (name === "password") {
      setPassword(sanitizedValue);
      setErrors((prev) => ({
        ...prev,
        password:
          sanitizedValue.length < 8
            ? "Password must be at least 8 characters."
            : "",
      }));
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const sanitizedLoginInput = sanitizeInput(loginInput.trim());
    const sanitizedPassword = sanitizeInput(password.trim());

    const isEmail = sanitizedLoginInput.includes("@");

    // Validations
    if (!sanitizedLoginInput || !sanitizedPassword) {
      setErrors({
        loginInput: sanitizedLoginInput
          ? ""
          : "Email or phone number is required.",
        password: sanitizedPassword ? "" : "Password is required.",
      });
      return toast.error("Please fill in all fields.");
    }

    if (sanitizedPassword.length < 6) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters.",
      }));
      return toast.error("Password must be at least 6 characters.");
    }

    const payload = isEmail
      ? { email: sanitizedLoginInput, password: sanitizedPassword }
      : { phone: sanitizedLoginInput, password: sanitizedPassword };

    setLoading(true);
    try {
      const response = await fetch(
        `${VITE_BACKEND_BASE_URL}/api/students/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // important to send cookies
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Login error response:", data);
        return toast.error(
          data.message || "Login failed. Please check credentials."
        );
      }


      toast.success("Login successful!");
      setUser(data.user);
      setUserType(data.user?.type || "student");
      setShouldFetchUser(true);
      setShowLogin(false);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Logo Section */}
      <img
        src={assets.logo || "/fallback-logo.png"}
        alt="Company Logo"
        className="w-32 sm:w-40 flex justify-start ml-20"
      />

      {/* Login Form Section */}
      <div className="flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 -mt-4">
        <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl flex flex-col items-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1F4C56]">
              Don’t have an account?
            </h2>
            <button
              type="button"
              className="text-[#1F4C56] text-lg sm:text-xl font-medium hover:underline"
              aria-label="Navigate to Sign Up"
              onClick={() => navigate("/student/signup")}
            >
              Sign Up
            </button>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl text-[#204B55] font-semibold mb-8">
            Login
          </h1>

          {/* Form Inputs */}
          <form
            className="w-full flex flex-col items-center space-y-6"
            onSubmit={onSubmitHandler}
            noValidate
          >
            <div
              className={`w-full flex items-center gap-4 border-b-2 ${
                errors.loginInput ? "border-red-500" : "border-[#1F4C56]"
              } pb-2`}
            >
              <BiSolidUserRectangle
                className="size-8 text-[#1F4C56] mx-6"
                aria-hidden="true"
              />
              <label htmlFor="phoneOrEmail" className="sr-only">
                Phone or Email
              </label>
              <input
                id="phoneOrEmail"
                name="loginInput"
                type="text"
                value={loginInput}
                onChange={handleInputChange}
                placeholder="Phone or Email"
                className="w-full px-4 py-2 text-lg sm:text-xl text-[#1F4C56] font-medium placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:ring-0"
                disabled={loading}
                required
                aria-required="true"
                aria-invalid={errors.loginInput ? "true" : "false"}
              />
              <img
                src={
                  errors.loginInput
                    ? assets.crossTick || "/error-icon.png"
                    : assets.rightTick || "/tick-icon.png"
                }
                alt={errors.loginInput ? "Error" : "Valid"}
                className="w-5 h-5 mx-2"
              />
            </div>
            {errors.loginInput && (
              <p className="text-red-500 text-sm mt-1 w-full">
                {errors.loginInput}
              </p>
            )}

            <div
              className={`w-full relative flex items-center gap-4 border-b-2 ${
                errors.password ? "border-red-500" : "border-[#1F4C56]"
              } pb-2`}
            >
              <RiLock2Fill
                className="size-8 text-[#1F4C56] mx-6"
                aria-hidden="true"
              />
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handleInputChange}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                placeholder="Password"
                className="w-full px-4 py-2 text-lg sm:text-xl text-[#1F4C56] font-medium placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:ring-0"
                disabled={loading}
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
                  className="absolute right-10 top-2.5 text-[#1F4C56] font-semibold cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={25} /> : <Eye size={25} />}
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
              <p className="text-red-500 text-sm mt-1 w-full">
                {errors.password}
              </p>
            )}

            {/* Login Button */}
            <button
              type="submit"
              className="w-full sm:w-auto bg-[#1F4C56] text-white px-8 py-3 rounded-full text-lg sm:text-xl font-semibold hover:bg-[#2D7B67] focus:outline-none focus:ring-2 focus:ring-[#2D7B67] transition duration-300"
              disabled={loading}
              aria-label="Sign In"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Logging in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Remember Me and Forgot Password */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="appearance-none size-6 bg-[#AAD294] rounded checked:bg-[#1F4C56] checked:relative checked:after:content-[''] checked:after:absolute checked:after:top-[4px] checked:after:left-[9px] checked:after:w-[8px] checked:after:h-[18px] checked:after:border-r-4 checked:after:border-b-4 checked:after:border-white checked:after:rotate-45 checked:after:-mt-[2px]"
                    aria-label="Remember Me"
                  />
                  <span className="ml-2 text-[#1F4C56] text-xl font-medium">
                    Remember Me
                  </span>
                </label>
              </div>
              <button
                type="button"
                className="text-[#1F4C56] text-base sm:text-lg font-medium hover:underline"
                aria-label="Navigate to Forgot Password"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
