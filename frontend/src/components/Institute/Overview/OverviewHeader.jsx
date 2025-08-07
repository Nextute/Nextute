import React from "react";
import { motion } from "framer-motion";
import { RiVerifiedBadgeFill } from "react-icons/ri";

const OverviewHeader = ({ data }) => {
  const basicInfo = data || {};
  const {
    institute_name = "Institute Name",
    logo = "https://via.placeholder.com/150",
    motto = "Empowering Future Leaders",
    establishedYear = "N/A",
    exams = [],
    is_verified = true,
  } = basicInfo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative w-full container mx-auto px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-gray-100 py-6 sm:py-8 lg:py-10 my-4 sm:my-6 overflow-hidden"
    >
      {/* Decorative Gradient Border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2D7A67] to-[#AAD294]"></div>

      <div className="relative flex flex-col lg:flex-row justify-between items-center lg:items-start gap-4 sm:gap-6 lg:gap-8">
        {/* Left Section: Logo, Name, Motto, Established Year */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-3 sm:space-y-4 w-full lg:w-2/3"
        >
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <motion.img
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              src={logo}
              alt={`${institute_name} Logo`}
              className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full object-cover border-2  shadow-md"
            />
            <div className="space-y-2">
              <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">
                  {institute_name}
                </h1>
                {is_verified && (
                  <RiVerifiedBadgeFill
                    className="w-5 h-5 sm:w-6 sm:h-6 text-[#2D7A67]"
                    aria-label="Verified Institute"
                  />
                )}
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
                <span className="text-gray-600 text-xs sm:text-sm font-medium ml-1">
                  (4.5/5)
                </span>
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-sm sm:text-base italic font-medium max-w-md leading-relaxed">
            "{motto}"
          </p>
          <p className="text-gray-500 text-xs sm:text-sm font-medium">
            Established:{" "}
            <span className="text-base sm:text-lg text-[#2D7A67]">
              {establishedYear}
            </span>
          </p>
        </motion.div>

        {/* Right Section: Targeted Exams */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full lg:w-1/3"
        >
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 text-center lg:text-right">
            Targeted Exams
          </h2>
          {exams.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 justify-center lg:justify-end">
              {exams.map((exam, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.4 + index * 0.1,
                    ease: "easeOut",
                  }}
                  whileHover={{ scale: 1.05 }}
                  className="w-24 sm:w-28 bg-[#2D7A67]/10 text-[#2D7A67] text-xs sm:text-sm font-semibold py-2 rounded-full shadow-sm hover:bg-[#2D7A67]/20 hover:shadow-md transition-all duration-300 text-center"
                >
                  {exam.toUpperCase()}
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-xs sm:text-sm text-center lg:text-right">
              No targeted exams specified.
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OverviewHeader;
