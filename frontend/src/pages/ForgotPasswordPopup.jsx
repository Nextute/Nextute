import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import axios from "axios";

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
      toast.error("Email is required.");
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
        toast.success("Password reset email sent successfully!");
        setShowForgotPassword(false);
        setEmail("");
      } else {
        throw new Error("Unexpected response status: " + response.status);
      }
    } catch (error) {
      const message =
        error.response?.status === 400
          ? "Invalid email address."
          : error.response?.data?.message ||
            "Failed to send reset email. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/70 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg mx-4 p-6 relative">
        {/* Close Button */}
        <button
          onClick={() => setShowForgotPassword(false)}
          className="absolute top-4 right-4 text-black bg-gray-300 rounded-full p-2 font-bold focus:outline-none"
          aria-label="Close popup"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Forgot Password
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Enter your email address to receive a password reset link.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-gray-900 text-base font-medium"
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
                error ? "border-red-500" : "border-teal-600"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-base`}
              disabled={loading}
              required
            />
            {error && (
              <p className="text-red-500 text-sm" role="alert">
                {error}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-[#1F4C56] text-white py-3 rounded-full text-lg font-semibold hover:bg-[#2D7B67] transition disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </span>
            ) : (
              "Send Reset Email"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
