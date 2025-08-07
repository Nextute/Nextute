import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { AppContext } from "../context/AppContext";

export default function ForgotPasswordPopup() {
  const {
    showForgotPassword,
    setShowForgotPassword,
    VITE_BACKEND_BASE_URL,
    userType,
  } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Sync popup visibility with route
  useEffect(() => {
    if (location.pathname === "/forgot-password") {
      setShowForgotPassword(true);
    } else {
      setShowForgotPassword(false);
    }
  }, [location.pathname, setShowForgotPassword]);

  // Handle body scroll lock
  useEffect(() => {
    if (showForgotPassword) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showForgotPassword]);

  if (!showForgotPassword) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter a valid email address.");
      toast.error("Email is required.", {
        position: "top-right",
        duration: 3000,
        style: {
          background: "#E6EDE2",
          color: "#144E53",
          borderRadius: "8px",
        },
      });
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${VITE_BACKEND_BASE_URL}/api/auth/forgot-password`,
        { email },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Password reset email sent successfully!", {
          position: "top-right",
          duration: 3000,
          style: {
            background: "#E6EDE2",
            color: "#144E53",
            borderRadius: "8px",
          },
        });
        setShowForgotPassword(false);
        setEmail("");
        navigate("/login"); // Redirect to login after success
      } else {
        throw new Error("Unexpected response status: " + response.status);
      }
    } catch (error) {
        console.log("Error sending reset email:", error);
        
      const message =
        error.response?.status === 400
          ? "Invalid email address."
          : error.response?.data?.message ||
            "Failed to send reset email. Please try again.";
      setError(message);
      toast.error(message, {
        position: "top-right",
        duration: 3000,
        style: {
          background: "#E6EDE2",
          color: "#144E53",
          borderRadius: "8px",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowForgotPassword(false);
    navigate(-1); // Go back to previous route
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed inset-0 z-50 backdrop-blur-sm bg-black/70 flex items-center justify-center"
      aria-labelledby="forgot-password-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-11/12 max-w-md bg-white rounded-2xl shadow-lg mx-4 p-4 sm:p-6 lg:p-8 relative border border-[#2D7A66]/10"
      >
        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleClose}
          className="absolute top-4 right-4 text-[#144E53] bg-[#E6EDE2] rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-[#93E9A2]"
          aria-label="Close Forgot Password Popup"
        >
          <X className="w-5 h-5" />
        </motion.button>

        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          id="forgot-password-title"
          className="text-xl sm:text-2xl font-bold text-[#144E53] text-center mb-4"
        >
          Forgot Password
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="text-center text-gray-600 text-sm sm:text-base mb-6"
        >
          Enter your email address to receive a password reset link.
        </motion.p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="flex flex-col gap-2"
          >
            <label
              htmlFor="email"
              className="text-[#144E53] text-sm sm:text-base font-medium"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={`w-full px-4 py-2 border-2 ${
                error ? "border-red-500" : "border-[#2D7A66]"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93E9A2] text-sm sm:text-base bg-[#E6EDE2]/30`}
              disabled={loading}
              required
              aria-describedby={error ? "email-error" : undefined}
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                id="email-error"
                className="text-red-500 text-sm"
                role="alert"
              >
                {error}
              </motion.p>
            )}
          </motion.div>
          <motion.button
            type="submit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-[#2D7A66] text-white py-3 rounded-full text-sm sm:text-base font-semibold hover:bg-[#144E53] transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#93E9A2]"
            disabled={loading}
            aria-label="Send Password Reset Email"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </span>
            ) : (
              "Send Reset Email"
            )}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}
