import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = Array(6)
    .fill()
    .map(() => React.createRef());

  const VITE_BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL; 
  const navigate = useNavigate();

  // Load email and userType from cookies
  useEffect(() => {
    const storedEmail = Cookies.get("signupEmail");
    const storedUserType = Cookies.get("userType");

    if (!storedEmail || !storedUserType) {
      toast.error("Missing signup information. Please sign up again.");
      userType === "institute"
        ? navigate("/institute/signup")
        : navigate("/student/signup"); // Redirect to signup if cookies are missing
    } else {
      setEmail(storedEmail);
      setUserType(storedUserType);
    }

    if (inputRefs[0].current) inputRefs[0].current.focus();

    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleCodeChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) inputRefs[index + 1].current.focus();
      if (!value && index > 0) inputRefs[index - 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const getVerifyEndpoint = () => {
    return userType === "institute"
      ? "/api/institutes/verify"
      : "/api/students/verify";
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");

    if (verificationCode.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }

    if (!userType || !email) {
      toast.error("Missing user info. Please try signing up again.");
      navigate("/");
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = getVerifyEndpoint();
      const response = await axios.post(`${VITE_BACKEND_BASE_URL}${endpoint}`, {
        email,
        code: verificationCode,
      });

      toast.success(response.data.message || "Verification successful", {
        duration: 1500,
      });

      // Clear cookies
      Cookies.remove("signupEmail");
      Cookies.remove("userType");

      // Navigate to homepage
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    if (resendCooldown > 0) return;

    if (!userType || !email) {
      toast.error("Missing user info. Please try signing up again.");
      navigate("/signup");
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = getVerifyEndpoint();
      await axios.post(`${VITE_BACKEND_BASE_URL}${endpoint}`, { email });
      toast.success("New code sent to your email");
      setResendCooldown(60);
      setCode(["", "", "", "", "", ""]);
      inputRefs[0].current.focus();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-teal-300">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="flex items-center justify-center mx-auto -my-10">
          <img src={assets.logo} alt="logo" className="w-36" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Verify Your Account
        </h2>
        <p className="text-gray-600 text-center mb-2">
          We emailed you the six digit code to {email}
        </p>
        <p className="text-sm text-gray-500 text-center mb-6">
          Verifying as:{" "}
          <span className="font-semibold capitalize">{userType}</span>
        </p>
        <p className="text-gray-600 text-center mb-6">
          Enter the code below to confirm your email address
        </p>
        <form onSubmit={handleVerify}>
          <div className="flex justify-center space-x-3 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 bg-white border border-gray-300 rounded-lg flex items-center justify-center text-2xl font-semibold text-gray-800 shadow-sm text-center"
                disabled={isLoading}
              />
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "VERIFY"}
          </button>
        </form>
        <p className="text-gray-600 text-center mt-4">
          If you didn't receive a code!{" "}
          <a
            href="#"
            onClick={handleResend}
            className={`text-purple-600 font-semibold hover:underline ${
              resendCooldown > 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            RESEND {resendCooldown > 0 && `(${resendCooldown}s)`}
          </a>
        </p>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
