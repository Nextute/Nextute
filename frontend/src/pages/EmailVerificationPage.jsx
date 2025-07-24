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

//   const [isLoading, setIsLoading] = useState(false);
//   const [resendCooldown, setResendCooldown] = useState(0);
//   const inputRefs = Array(6)
//     .fill()
//     .map(() => React.createRef());

//   const {
//     VITE_BACKEND_BASE_URL,
//     user,
//     setUser,
//     userType,
//     setUserType,
//     showEmailVerification,
//     setShouldFetchUser,
//   } = useContext(AppContext);

//   const navigate = useNavigate();

//   const email = user?.email || localStorage.getItem("verify_email");
//   const type = userType || localStorage.getItem("verify_user_type");

//   useEffect(() => {
//     // Allow initial load to resolve values
//     if (!showEmailVerification) {
//       navigate("/");
//       return;

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
      handleSubmit();
    }

    // Wait for `email` and `type` to become available
//     if (!email || !type) return;

//     // Set context again if not present
//     if (!userType) setUserType(type);

//     inputRefs[0].current?.focus();

//     const interval = setInterval(() => {
//       setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [email, type, navigate, showEmailVerification, userType]);

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       if (!email || !type) {
//         toast.error("Missing signup info. Please signup again.");
//         navigate("/student/signup"); // fallback
//       }
//     }, 2000); // give it 2s to resolve context or localStorage

//     return () => clearTimeout(timeout);
//   }, [email, type]);

//   const handleCodeChange = (index, value) => {
//     if (!/^\d?$/.test(value)) return;
//     const updatedCode = [...code];
//     updatedCode[index] = value;
//     setCode(updatedCode);

//     if (value && index < 5) inputRefs[index + 1].current?.focus();
//     else if (!value && index > 0) inputRefs[index - 1].current?.focus();

  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };


  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newCode = [...code];
    for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
      newCode[i] = pastedData[i] || "";
    }
    setCode(newCode);
    inputRefs.current[Math.min(pastedData.length, 5)].focus();
    if (pastedData.length === 6) {
      handleSubmit();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const verificationCode = code.join("");
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
      const routePrefix =
        effectiveUserType === "student" ? "students" : "institutes";
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

        // Store user data in sessionStorage
        sessionStorage.setItem(
          "user",
          JSON.stringify(response.data.user || {})
        );
        sessionStorage.setItem("userType", effectiveUserType);
        sessionStorage.removeItem("verify_email");
        sessionStorage.removeItem("verify_user_type");

        setTimeout(() => {
          navigate(
            effectiveUserType === "student"
              ? "/student/dashboard"
              : "/institute/basic-info",
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
          : error.response?.data?.message ||
            "Verification failed. Please try again.";
      setError(message);
      toast.error(message);

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
      const routePrefix =
        effectiveUserType === "student" ? "students" : "institutes";
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
      setLoading(false);
    }
  };

  return (

    <div className="relative min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <img
          src={assets.logo || "/fallback-logo.png"}
          alt="Logo"
          className="w-24 sm:w-28 md:w-32"
        />
      </div>

      <div className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-6">
          Email Verification
        </h2>
        <p className="text-center text-gray-600 mb-6">
          We’ve sent a 6-digit code to{" "}
          <span className="font-semibold">{email || "your email"}</span>. Please
          enter it below.

          {/*
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
         </p> */}

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

                className="w-10 h-12 text-center text-2xl font-semibold border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#2D7A66] bg-white"
                disabled={isLoading}

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
            Didn’t receive the code?{" "}
            <button
              onClick={handleResendCode}
              className={`text-teal-600 font-semibold hover:underline ${
                isResendDisabled || loading || !email
                  ? "opacity-50 cursor-not-allowed"
                  : ""
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
