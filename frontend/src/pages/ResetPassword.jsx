import { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { RiLock2Fill } from "react-icons/ri";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const sanitizeInput = (input) => input.replace(/[<>]/g, "");

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [token, setToken] = useState("");
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    token: "",
  });

  const { VITE_BACKEND_BASE_URL, setShowLogin, setShowForgotPassword } =
    useContext(AppContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (!urlToken) {
      setErrors((prev) => ({
        ...prev,
        token: "No reset token provided in URL.",
      }));
      toast.error("No reset token provided. Please use a valid reset link.");
    }
    setToken(urlToken || "");
  }, [searchParams]);

  useEffect(() => {
    if (password.length > 0 && confirmPassword.length > 0 && token) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }

    if (password === confirmPassword) {
      setIsPasswordMatch(true);
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    } else {
      setIsPasswordMatch(false);
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match.",
      }));
    }
  }, [password, confirmPassword, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);

    if (name === "password") {
      setPassword(sanitizedValue);
      setErrors((prev) => ({
        ...prev,
        password: sanitizedValue ? "" : "Password is required.",
      }));
    } else if (name === "confirmPassword") {
      setConfirmPassword(sanitizedValue);
      setErrors((prev) => ({
        ...prev,
        confirmPassword: sanitizedValue
          ? sanitizedValue === password
            ? ""
            : "Passwords do not match."
          : "Confirm password is required.",
      }));
    }
  };

  const resetForm = () => {
    setPassword("");
    setConfirmPassword("");
    setErrors({ password: "", confirmPassword: "", token: "" });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const sanitizedPassword = sanitizeInput(password.trim());
    const sanitizedConfirmPassword = sanitizeInput(confirmPassword.trim());

    if (!sanitizedPassword || !sanitizedConfirmPassword) {
      setErrors({
        password: sanitizedPassword ? "" : "Password is required.",
        confirmPassword: sanitizedConfirmPassword
          ? ""
          : "Confirm password is required.",
        token: errors.token,
      });
      return toast.error("Please fill in all fields.");
    }

    if (!isPasswordMatch) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match.",
      }));
      return toast.error("Passwords do not match.");
    }

    if (!token) {
      setErrors((prev) => ({
        ...prev,
        token: "Invalid or missing reset token.",
      }));
      return toast.error("Invalid or missing reset token.");
    }

    const payload = {
      newPassword: sanitizedPassword, // Changed to match backend expectation
      token,
    };

    setLoading(true);
    try {
      const response = await axios.post(
        `${VITE_BACKEND_BASE_URL}/api/auth/reset-password`,
        payload,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        toast.success("Password reset successfully");
        setShowLogin(true);
        setShowForgotPassword(false);
        resetForm();
        navigate("/student/login");
      }
    } catch (error) {
      console.error("Reset Password Error:", error);
      const message =
        error.response?.status === 400
          ? error.response?.data?.error || "Invalid or expired token."
          : error.response?.data?.error ||
            "Failed to reset password. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <img
        src={assets.logo || "/fallback-logo.png"}
        alt="Company Logo"
        className="w-32 sm:w-40 flex justify-start ml-20"
      />

      <div className="flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 -mt-4">
        <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl flex flex-col items-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1F4C56]">
              Back to Login?
            </h2>
            <button
              type="button"
              className="text-[#1F4C56] text-lg sm:text-xl font-medium hover:underline"
              aria-label="Navigate to Login"
              onClick={() => navigate("/student/login")}
            >
              Sign In
            </button>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl text-[#204B55] font-semibold mb-8">
            Reset Password
          </h1>

          {errors.token && (
            <p className="text-red-500 text-sm mb-4 w-full text-center">
              {errors.token}
            </p>
          )}

          <form
            className="w-full flex flex-col items-center space-y-6"
            onSubmit={onSubmitHandler}
            noValidate
          >
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
                New Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handleInputChange}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                placeholder="New Password"
                className="w-full px-4 py-2 text-lg sm:text-xl text-[#1F4C56] font-medium placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:ring-0"
                disabled={loading || !!errors.token}
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

            <div
              className={`w-full relative flex items-center gap-4 border-b-2 ${
                errors.confirmPassword ? "border-red-500" : "border-[#1F4C56]"
              } pb-2`}
            >
              <RiLock2Fill
                className="size-8 text-[#1F4C56] mx-6"
                aria-hidden="true"
              />
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={handleInputChange}
                onFocus={() => setIsConfirmPasswordFocused(true)}
                onBlur={() => setIsConfirmPasswordFocused(false)}
                placeholder="Confirm Password"
                className="w-full px-4 py-2 text-lg sm:text-xl text-[#1F4C56] font-medium placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:ring-0"
                disabled={loading || !!errors.token}
                required
                aria-required="true"
                aria-invalid={errors.confirmPassword ? "true" : "false"}
              />
              {isConfirmPasswordFocused && (
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setShowConfirmPassword((prev) => !prev);
                  }}
                  className="absolute right-10 top-2.5 text-[#1F4C56] font-semibold cursor-pointer"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={25} />
                  ) : (
                    <Eye size={25} />
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
              <p className="text-red-500 text-sm mt-1 w-full">
                {errors.confirmPassword}
              </p>
            )}

            <button
              type="submit"
              className="w-full sm:w-auto bg-[#1F4C56] text-white px-8 py-3 rounded-full text-lg sm:text-xl font-semibold hover:bg-[#2D7B67] focus:outline-none focus:ring-2 focus:ring-[#2D7B67] transition duration-300"
              disabled={buttonDisabled || loading || !!errors.token}
              aria-label="Reset Password"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Resetting...
                </span>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
