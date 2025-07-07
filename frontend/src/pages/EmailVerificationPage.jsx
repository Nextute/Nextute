import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AppContext } from "../context/AppContext";

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
  const { setUser, setAuthToken } = useContext(AppContext);

  useEffect(() => {
    const storedEmail = Cookies.get("signupEmail");
    const storedUserType = Cookies.get("userType");

    if (!storedEmail || !storedUserType) {
      toast.error("Missing signup info. Please signup again.");
      navigate(
        "/" +
          (storedUserType === "institute" ? "institute" : "student") +
          "/signup"
      );
      return;
    }

    setEmail(storedEmail);
    setUserType(storedUserType);
    inputRefs[0].current?.focus();

    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleCodeChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const updated = [...code];
      updated[index] = value;
      setCode(updated);

      if (value && index < 5) inputRefs[index + 1].current?.focus();
      if (!value && index > 0) inputRefs[index - 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const getVerifyEndpoint = () =>
    userType === "institute"
      ? "/api/institutes/verify"
      : "/api/students/verify";

  const handleVerify = async (e) => {
    e.preventDefault();
    const fullCode = code.join("");

    if (fullCode.length !== 6) return toast.error("Please enter all 6 digits");

    setIsLoading(true);

    const userType = Cookies.get("userType"); // Read userType from cookies

    try {
      const res = await axios.post(
        `${VITE_BACKEND_BASE_URL}${getVerifyEndpoint()}`,
        {
          email,
          code: fullCode,
        }
      );

      // ✅ Save user + token to cookies
      const userData = res.data.user;
      const token = res.data.token;

      if (userData && token) {
        Cookies.set("authToken", token, { path: "/" });
        Cookies.set("user", JSON.stringify(userData), { path: "/" });

        setUser(userData); // ✅ update context
        setAuthToken(token); // ✅ update context
      }

      toast.success(res.data.message || "Verified successfully");

      // Remove cookies after successful verification
      Cookies.remove("signupEmail");
      Cookies.remove("userType");

      // Redirect based on userType
      if (userType === "student") {
        navigate("/"); // Redirect student to homepage
      } else if (userType === "institute") {
        navigate("/institute/basic-info");
      } else {
        navigate("/"); // fallback in case userType is missing or invalid
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    if (resendCooldown > 0) return;

    try {
      setIsLoading(true);
      await axios.post(`${VITE_BACKEND_BASE_URL}${getVerifyEndpoint()}`, {
        email,
      });
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
    <div className="min-h-screen w-full bg-[url('/src/assets/signup_bg.png')] bg-cover bg-center flex items-center justify-center relative">
      <div className="absolute inset-0 backdrop-blur-sm bg-black/30 z-0" />

      <div className="relative z-10 bg-white/95 border border-gray-200 rounded-2xl shadow-xl p-6 md:p-8 max-w-lg w-full">
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
          Verifying as{" "}
          <span className="font-semibold capitalize">{userType}</span>
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
                className="w-10 h-12 sm:w-12 sm:h-14 text-center text-2xl font-semibold border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-[#2D7A66] bg-white"
                disabled={isLoading}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 sm:py-3 rounded-full bg-[#2D7A66] text-white font-semibold hover:bg-[#204B54] transition-colors disabled:opacity-60"
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
