import { useContext, useEffect } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const LoginPopup = () => {
  const { showLogin, setShowLogin } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (showLogin) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup on unmount to ensure overflow is restored
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showLogin]);

  if (!showLogin) return null;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/70 flex items-center justify-center">
      <div className="w-full max-w-lg sm:max-w-3xl bg-[#FFF] mx-4 sm:mx-8 p-4 sm:p-6 relative rounded-3xl">
        {/* Close Button */}
        <button
          onClick={() => setShowLogin(false)}
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
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#1A3C34]  text-center mb-6 sm:mb-8">
          Login
        </h2>

        {/* Signup Options */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
          {/* Student Signup */}
          <div className="w-full max-w-xs p-4">
            <img
              src={assets.student_signup}
              alt="Student Signup"
              className="w-full h-36 sm:h-40 object-cover rounded-lg mb-6"
            />

            <button
              className="w-full bg-[#2D7B67] text-white text-base sm:text-lg font-medium py-2 px-4 rounded-full hover:bg-[#256357] transition-colors duration-200"
              onClick={() => {
                navigate("/student/login");
                setShowLogin(false);
              }}
            >
              Login as a Student
            </button>
          </div>

          {/* Institute Signup */}
          <div className="w-full max-w-xs p-4">
            <img
              src={assets.institute_signup}
              alt="Institute Signup"
              className="w-full h-36 sm:h-40 object-cover rounded-lg mb-6"
            />
            <button
              className="w-full bg-[#2D7B67] text-white text-base sm:text-lg font-medium py-2 px-4 rounded-full hover:bg-[#256357] transition-colors duration-200"
              onClick={() => {
                navigate("/institute/login");
                setShowLogin(false);
              }}
            >
              Login as an Institute
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
