import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AppContext } from "../context/AppContext";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = Array(6)
    .fill()
    .map(() => React.createRef());

  const {
    VITE_BACKEND_BASE_URL,
    user,
    setUser,
    userType,
    setUserType,
    showEmailVerification,
    setShouldFetchUser,
  } = useContext(AppContext);

  const navigate = useNavigate();

  const email = user?.email || localStorage.getItem("verify_email");
  const type = userType || localStorage.getItem("verify_user_type");

  useEffect(() => {
    // Allow initial load to resolve values
    if (!showEmailVerification) {
      navigate("/");
      return;
    }

    // Wait for `email` and `type` to become available
    if (!email || !type) return;

    // Set context again if not present
    if (!userType) setUserType(type);

    inputRefs[0].current?.focus();

    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [email, type, navigate, showEmailVerification, userType]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!email || !type) {
        toast.error("Missing signup info. Please signup again.");
        navigate("/student/signup"); // fallback
      }
    }, 2000); // give it 2s to resolve context or localStorage

    return () => clearTimeout(timeout);
  }, [email, type]);

  const handleCodeChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const updatedCode = [...code];
    updatedCode[index] = value;
    setCode(updatedCode);

    if (value && index < 5) inputRefs[index + 1].current?.focus();
    else if (!value && index > 0) inputRefs[index - 1].current?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const getVerifyEndpoint = () =>
    type === "institute" ? "/api/institutes/verify" : "/api/students/verify";

  const getResendEndpoint = () =>
    type === "institute"
      ? "/api/institutes/resend-verification"
      : "/api/students/resend-verification";

  const handleVerify = async (e) => {
    e.preventDefault();
    const fullCode = code.join("");

    if (fullCode.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${VITE_BACKEND_BASE_URL}${getVerifyEndpoint()}`,
        { email, code: fullCode },
        { withCredentials: true }
      );

      toast.success(res.data.message || "Verified successfully");
      setUser(res.data.user);
      setShouldFetchUser(true);
      setCode(["", "", "", "", "", ""]);

      navigate(type === "institute" ? "/institute/basic-info" : "/");
      // Clear storage
      localStorage.removeItem("verify_email");
      localStorage.removeItem("verify_user_type");
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    if (resendCooldown > 0 || !email) return;

    setIsLoading(true);
    try {
      await axios.post(
        `${VITE_BACKEND_BASE_URL}${getResendEndpoint()}`,
        { email },
        { withCredentials: true }
      );
      toast.success("New code sent to your email");
      setResendCooldown(60);
      setCode(["", "", "", "", "", ""]);
      inputRefs[0].current?.focus();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/src/assets/signup_bg.png')] bg-cover bg-center flex items-center justify-center relative">
      <div className="absolute inset-0 backdrop-blur-sm bg-black/30" />
      <div className="relative bg-white/95 border border-gray-200 rounded-2xl shadow-xl p-6 max-w-lg w-full">
        <div className="flex justify-center mb-4">
          <img src={assets.logo} alt="Logo" className="w-36" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Verify Your Email
        </h2>
        <p className="text-center text-sm text-gray-600 mb-1">
          We sent a 6-digit code to <span className="font-medium">{email}</span>
        </p>
        <p className="text-center text-sm text-gray-500 mb-3">
          Verifying as <span className="font-semibold capitalize">{type}</span>
        </p>
        <p className="text-center text-sm text-gray-700 mb-6">
          Enter the code below to confirm your account.
        </p>

        <form onSubmit={handleVerify}>
          <div className="flex justify-center gap-2 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 h-12 text-center text-2xl font-semibold border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#2D7A66] bg-white"
                disabled={isLoading}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 rounded-full bg-[#2D7A66] text-white font-semibold hover:bg-[#204B54] disabled:opacity-60"
          >
            {isLoading ? "Verifying..." : "VERIFY"}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600">
          Didn't receive the code?{" "}
          <button
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className={`font-semibold text-[#2D7A66] hover:underline ${
              resendCooldown > 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            RESEND {resendCooldown > 0 && `(${resendCooldown}s)`}
          </button>
        </p>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
