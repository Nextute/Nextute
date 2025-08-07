import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { BsChatTextFill } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { assets } from "../assets/assets";

// Default fallback image
const DEFAULT_IMAGE =
  assets.coaching || "https://via.placeholder.com/400x300?text=Institute+Image";

const defaultInstitute = {
  id: "default-1",
  institute_name: "Sample Coaching Institute",
  image: DEFAULT_IMAGE,
  rating: 4.5,
  address: "123 Main Street, Hajipur – 844101",
  tags: ["JEE", "NEET", "Class 12"],
};

const Card = ({ institute = defaultInstitute }) => {
  const navigate = useNavigate();

  // Normalize backend data to handle inconsistencies
  const normalizedInstitute = {
    id: institute.id?.trim() || defaultInstitute.id,
    name:
      institute.basic_info?.institute_name?.trim() ||
      institute.basic_info?.name?.trim() ||
      institute.institute_name?.trim() ||
      defaultInstitute.institute_name,
    image:
      institute.basic_info?.logo?.trim() ||
      institute.image?.trim() ||
      defaultInstitute.image,
    rating:
      typeof institute.rating === "number" &&
      institute.rating >= 0 &&
      institute.rating <= 5
        ? institute.rating
        : parseFloat(institute.rating) || defaultInstitute.rating,
    address:
      institute.contact_details?.headOffice?.address?.trim() ||
      institute.address?.trim() ||
      defaultInstitute.address,
    tags: Array.isArray(institute.basic_info?.exams)
      ? institute.basic_info.exams
          .map((exam) => exam?.trim()?.toUpperCase())
          .filter((tag) => tag)
          .slice(0, 3)
      : Array.isArray(institute.tags)
      ? institute.tags
          .filter((tag) => typeof tag === "string" && tag.trim())
          .slice(0, 3)
      : defaultInstitute.tags,
  };

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const starCount =
      typeof rating === "string" ? parseFloat(rating) || 0 : rating;
    const fullStars = Math.floor(starCount);
    const hasHalfStar = starCount % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar
            key={`full-${i}`}
            className="text-yellow-400 w-3 h-3 sm:w-4 sm:h-4"
          />
        ))}
        {hasHalfStar && (
          <FaStarHalfAlt className="text-yellow-400 w-3 h-3 sm:w-4 sm:h-4" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar
            key={`empty-${i}`}
            className="text-gray-300 w-3 h-3 sm:w-4 sm:h-4"
          />
        ))}
        <span className="text-xs sm:text-sm text-gray-600 ml-1">
          {starCount.toFixed(1)}
        </span>
      </div>
    );
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hover: {
      scale: 1.03,
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
      className="w-full max-w-[22rem] sm:max-w-[24rem] bg-gradient-to-br from-white to-emerald-50/20 border border-emerald-200/40 rounded-2xl shadow-md mx-auto my-4 overflow-hidden h-[28rem] sm:h-[30rem] flex flex-col"
      onClick={() => navigate(`/institute/overview/${normalizedInstitute.id}`)}
    >
      {/* Image Section */}
      <div className="w-full h-48 sm:h-56 aspect-[4/3] p-3">
        <motion.img
          src={normalizedInstitute.image}
          alt={`Coaching - ${normalizedInstitute.name}`}
          className="w-full h-full object-cover rounded-xl"
          loading="lazy"
          variants={imageVariants}
          onError={(e) => {
            e.target.src = DEFAULT_IMAGE;
          }}
        />
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col p-4 sm:p-5 space-y-3">
        {/* Title + Rating */}
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-emerald-600 line-clamp-1">
            {normalizedInstitute.name}
          </h2>
          <div className="text-emerald-600">
            {renderStars(normalizedInstitute.rating)}
          </div>
        </div>

        {/* Address + Tags */}
        <div className="flex-1 flex items-start justify-between">
          <div className="flex items-start gap-1.5 text-gray-700 max-w-[60%]">
            <FaLocationDot className="text-emerald-600 w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-tight">
              {normalizedInstitute.address}
            </p>
          </div>
          <div className="flex flex-wrap gap-1 max-w-[35%]">
            {normalizedInstitute.tags.length > 0 ? (
              normalizedInstitute.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-emerald-100 text-emerald-800 text-[0.65rem] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full hover:bg-emerald-200 transition whitespace-nowrap"
                >
                  {tag.length > 12 ? `${tag.slice(0, 12)}...` : tag}
                </span>
              ))
            ) : (
              <span className="text-gray-500 text-xs italic">No tags</span>
            )}
          </div>
        </div>
      </div>

      {/* Button Section */}
      <div className="h-16 sm:h-20 flex items-center justify-center p-4 sm:p-5 pt-0">
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="w-full max-w-48 bg-emerald-600 text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          onClick={() =>
            navigate(`/institute/overview/${normalizedInstitute.id}`)
          }
        >
          <BsChatTextFill className="w-4 h-4 sm:w-5 sm:h-5" />
          Enquiry Now
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Card;
