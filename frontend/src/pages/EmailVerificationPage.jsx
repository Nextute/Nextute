import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import { toast } from "react-hot-toast";
import axios from "axios";
import { assets } from "../assets/assets";

const EmailVerificationPage = () => {
  const {
    VITE_BACKEND_BASE_URL,
    userType,
    setShowEmailVerification,
    setUser,
    setUserType,
    setShouldFetchUser,
    user,
  } = useContext(AppContext);

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const email = sessionStorage.getItem("verify_email") || "";
  const effectiveUserType =
    userType || sessionStorage.getItem("verify_user_type") || "student";

  useEffect(() => {
    if (user?.emailVerified) {
      toast.success("Email already verified!");
      setShowEmailVerification(false);
      navigate(`/${effectiveUserType}/dashboard`, { replace: true });
    }
  }, [user, navigate, effectiveUserType]);

  useEffect(() => {
    if (!email) {
      toast.error("No email found. Please sign up again.");
      navigate(`/${effectiveUserType}/signup`, { replace: true });
    }
    inputRefs.current[0]?.focus();
  }, [email, effectiveUserType, navigate]);

  useEffect(() => {
    let timer;
    if (isResendDisabled && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsResendDisabled(false);
    }
    return () => clearInterval(timer);
  }, [isResendDisabled, countdown]);

  const handleInputChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(0, 1);
    setCode(newCode);
    if (value && index < 5) inputRefs.current[index + 1].focus();
    if (newCode.every((digit) => digit !== "")) {
      handleSubmit(null, newCode.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newCode = [...code];
    for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
      newCode[i] = pastedData[i] || "";
    }
    setCode(newCode);
    inputRefs.current[Math.min(pastedData.length, 5)].focus();
    if (pastedData.length === 6) {
      handleSubmit(null, newCode.join(""));
    }
  };

  const handleSubmit = async (e, manualCode) => {
    if (e) e.preventDefault();
    const verificationCode = manualCode || code.join("");
    
    if (verificationCode.length !== 6 || !/^\d{6}$/.test(verificationCode)) {
      setError("Please enter a valid 6-digit code.");
      toast.error("Invalid verification code.");
      return;
    }

    if (!email) {
      toast.error("No email found. Please sign up again.");
      navigate(`/${effectiveUserType}/signup`, { replace: true });
      return;
    }

    setLoading(true);
    setError("");
    try {
      const routePrefix = effectiveUserType === "student" ? "students" : "institutes";
      const response = await axios.post(
        `${VITE_BACKEND_BASE_URL}/api/${routePrefix}/verify`,
        { email, code: verificationCode },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Email verified successfully!");
        setShowEmailVerification(false);
        setUser(response.data.user || {});
        setUserType(effectiveUserType);
        setShouldFetchUser(true);
        sessionStorage.setItem("user", JSON.stringify(response.data.user || {}));
        sessionStorage.setItem("userType", effectiveUserType);
        sessionStorage.removeItem("verify_email");
        sessionStorage.removeItem("verify_user_type");

        setTimeout(() => {
          navigate(
            effectiveUserType === "student" ? "/student/dashboard" : "/institute/basic-info",
            { replace: true }
          );
        }, 1000);
      } else {
        throw new Error("Unexpected response status: " + response.status);
      }
    } catch (error) {
      const message =
        error.response?.status === 400
          ? "Invalid or expired verification code."
          : error.response?.data?.message || "Verification failed. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (isResendDisabled || !email) {
      if (!email) {
        toast.error("No email found. Please sign up again.");
        navigate(`/${effectiveUserType}/signup`, { replace: true });
      }
      return;
    }

    setLoading(true);
    setError("");
    try {
      const routePrefix = effectiveUserType === "student" ? "students" : "institutes";
      const response = await axios.post(
        `${VITE_BACKEND_BASE_URL}/api/${routePrefix}/resend-verification`,
        { email },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Verification code resent successfully!");
        setIsResendDisabled(true);
        setCountdown(60);
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        throw new Error("Unexpected response status: " + response.status);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to resend verification code.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <img src={assets.logo || "/fallback-logo.png"} alt="Logo" className="w-24 sm:w-28 md:w-32" />
      </div>

      <div className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-6">
          Email Verification
        </h2>
        <p className="text-center text-gray-600 mb-6">
          We’ve sent a 6-digit code to <span className="font-semibold">{email || "your email"}</span>. Please enter it below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2 sm:gap-3">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                maxLength={1}
                ref={(el) => (inputRefs.current[index] = el)}
                className={`w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl border-2 ${
                  error ? "border-red-500" : "border-teal-600"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500`}
                disabled={loading}
                aria-label={`Verification code digit ${index + 1}`}
              />
            ))}
          </div>
          {error && (
            <p className="text-red-500 text-sm text-center" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-[#1F4C56] text-white py-3 rounded-full text-lg font-semibold hover:bg-[#2D7B67] transition disabled:bg-gray-400"
            disabled={loading || !email}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Verifying...
              </span>
            ) : (
              "Verify Email"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Didn’t receive the code? {" "}
            <button
              onClick={handleResendCode}
              className={`text-teal-600 font-semibold hover:underline ${
                isResendDisabled || loading || !email ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isResendDisabled || loading || !email}
            >
              {isResendDisabled ? `Resend in ${countdown}s` : "Resend Code"}
            </button>
          </p>
          <button
            onClick={() => navigate(`/${effectiveUserType}/signup`)}
            className="mt-4 text-teal-600 font-semibold hover:underline"
          >
            Back to Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
