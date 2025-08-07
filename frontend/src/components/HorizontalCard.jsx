import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPhoneAlt, FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa";
import { BsChatTextFill } from "react-icons/bs";
import { assets } from "../assets/assets";

// Default fallback image (replace with your assets import or a placeholder URL)
const DEFAULT_IMAGE =
  assets.coaching || "https://via.placeholder.com/400x300?text=Institute+Image";

const HorizontalCard = ({
  id,
  name,
  address,
  tags = [],
  contact,
  image,
  rating = 4.5,
}) => {
  const navigate = useNavigate();

  // Data normalization to handle inconsistencies
  const normalizedName = name?.trim() || "Unnamed Institute";
  const normalizedAddress = address?.trim() || "Address Not Available";
  const normalizedContact = contact?.trim() || "+91 91234 56789";
  const normalizedImage = image?.trim() || DEFAULT_IMAGE;
  const normalizedTags = Array.isArray(tags)
    ? tags.filter((tag) => typeof tag === "string" && tag.trim()).slice(0, 4)
    : [];
  const normalizedRating =
    typeof rating === "number" && rating >= 0 && rating <= 5 ? rating : 4.5;

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 },
    },
  };

  const imageVariants = {
    hover: { scale: 1.05, transition: { duration: 0.4 } },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      backgroundColor: "#10B981",
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="relative flex flex-col md:flex-row items-start bg-gradient-to-br from-white to-emerald-50/30 border border-emerald-200/40 rounded-3xl shadow-md max-w-3xl w-full mx-auto my-4 hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/institute/overview/${id || "unknown"}`)}
    >
      {/* Image Section */}
      <div className="w-full md:w-5/12 h-56 md:h-[320px] p-3">
        <motion.img
          src={normalizedImage}
          alt={`${normalizedName} Image`}
          className="w-full h-full object-cover rounded-2xl"
          loading="lazy"
          variants={imageVariants}
          onError={(e) => {
            e.target.src = DEFAULT_IMAGE;
          }} // Fallback on image load error
        />
      </div>

      {/* Content Section */}
      <div className="flex-1 p-4 sm:p-5 md:p-6 flex flex-col">
        {/* Header */}
        <div className="flex flex-row justify-between items-center mb-3">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 group-hover:text-emerald-600 line-clamp-1">
            {normalizedName}
          </h2>
          <div className="flex items-center gap-1 text-emerald-600">
            {Array(5)
              .fill()
              .map((_, i) => (
                <span
                  key={i}
                  className={
                    i < Math.floor(normalizedRating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                >
                  ★
                </span>
              ))}
            <span className="text-xs sm:text-sm text-gray-600 ml-1">
              {normalizedRating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-3 mb-8">
          <div className="flex items-start text-gray-700">
            <FaMapMarkerAlt className="mt-1 mr-2 w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-sm sm:text-base text-gray-600 line-clamp-2 leading-tight">
              {normalizedAddress}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mt-5">
            {normalizedTags.length > 0 ? (
              normalizedTags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-emerald-100 text-emerald-800 text-xs sm:text-sm px-3 py-1 rounded-lg hover:bg-emerald-200 transition"
                >
                  {tag.length > 20 ? `${tag.slice(0, 20)}...` : tag}
                </span>
              ))
            ) : (
              <span className="text-gray-500 text-sm italic">
                No tags available
              </span>
            )}
          </div>
        </div>

        {/* Contact Actions */}
        <div className="flex items-center gap-3 mb-4">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl px-3 sm:px-4 py-1.5 text-sm sm:text-base hover:shadow-sm"
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `tel:${normalizedContact}`;
            }}
          >
            <FaPhoneAlt className="w-4 h-4" />
            {normalizedContact}
          </motion.button>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl px-3 sm:px-4 py-1.5 text-sm sm:text-base hover:shadow-sm"
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `https://wa.me/${normalizedContact.replace(
                /\D/g,
                ""
              )}`;
            }}
          >
            <FaWhatsapp className="w-4 h-4" />
            WhatsApp
          </motion.button>
        </div>

        {/* Enquiry Button */}
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="absolute -bottom-3 right-3 bg-emerald-600 text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base flex items-center gap-2 shadow-md hover:shadow-lg"
          onClick={() => navigate(`/institute/overview/${id || "unknown"}`)}
        >
          <BsChatTextFill className="w-4 h-4 sm:w-5 sm:h-5" />
          Enquiry →
        </motion.button>
      </div>
    </motion.div>
  );
};

export default HorizontalCard;
