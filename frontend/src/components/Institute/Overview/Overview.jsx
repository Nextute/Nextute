import React from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaPhone, FaWhatsapp } from "react-icons/fa";
import { BsChatTextFill } from "react-icons/bs";
import SocialMedia from "./SocialMedia";

const Overview = ({ data, socialMediaData }) => {
  const basicInfo = JSON.parse(data?.basic_info || "{}");
  const contactInfo = JSON.parse(data?.contact_details || "{}");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
    >
      {/* About Us Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2D7A67] to-[#AAD294]"></div>
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 text-center">
          About Us
        </h2>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
          {basicInfo.description ||
            "We are dedicated to providing exceptional education and fostering a supportive learning environment for all students."}
        </p>
      </motion.div>

      {/* Vision & Mission Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2D7A67] to-[#AAD294]"></div>
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 text-center">
          Vision & Mission
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2">
              Our Vision
            </h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Our vision is to become a global leader in education by empowering
              students with comprehensive knowledge, critical thinking
              abilities, and real-world skills.
            </p>
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2">
              Our Mission
            </h3>
            <ul className="list-disc ml-5 text-gray-600 text-sm sm:text-base leading-relaxed space-y-1">
              <li>Offer cutting-edge curriculum tailored to industry needs.</li>
              <li>
                Cultivate a collaborative and inclusive learning community.
              </li>
              <li>Promote innovation and excellence in every endeavor.</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Contact Information Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="relative bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2D7A67] to-[#AAD294]"></div>
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 text-center">
          Get in Touch
        </h2>
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="flex items-center justify-center gap-2 sm:gap-3 text-gray-600"
          >
            <FaMapMarkerAlt className="text-[#2D7A67] text-base sm:text-lg" />
            <span className="text-sm sm:text-base">
              {contactInfo?.headOffice?.address ||
                "123 Education Lane, Learning City"}
            </span>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-[#2D7A67] text-white rounded-lg px-4 py-2 text-sm sm:text-base font-medium hover:bg-[#1A433A] transition-all duration-300 shadow-md"
              >
                <FaPhone />
                {data?.contact || "+91-234-567-8900"}
              </motion.button>

            <motion.a
              href={`https://wa.me/${data?.contact || "+1-234-567-8900"}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-green-500 text-white rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium hover:bg-green-600 transition-all duration-300 shadow-md"
              aria-label="Contact via WhatsApp"
            >
              <FaWhatsapp />
              WhatsApp
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const email = basicInfo?.email || "info@educationinstitute.com";
                const subject = encodeURIComponent("Course Enquiry");
                const body = encodeURIComponent(
                  "Hi, I would like to enquire about your courses."
                );
                window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
              }}
              className="flex items-center gap-2 bg-[#AAD294] text-gray-800 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium hover:bg-[#8ACB74] transition-all duration-300 shadow-md"
              aria-label="Send an enquiry email"
            >
              <BsChatTextFill />
              Enquiry
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Social Media Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="relative bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2D7A67] to-[#AAD294]"></div>
        <SocialMedia data={socialMediaData} />
      </motion.div>
    </motion.div>
  );
};

export default Overview;
