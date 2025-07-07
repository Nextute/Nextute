import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { BsChatTextFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { FaLocationDot } from "react-icons/fa6";

const defaultInstitute = {
  id: "default-1",
  name: "Sample Coaching Institute",
  image: assets.coaching,
  rating: 4.5, // Changed to numeric for consistency
  address: "123 Main Street, Hajipur – 844101",
  tags: ["JEE", "NEET", "Class 12"],
};

const Card = ({ institute = defaultInstitute }) => {
  const navigate = useNavigate();

  // Function to render stars based on rating
  const renderStars = (rating) => {
    let starCount;
    // Handle string rating (e.g., "*****") or numeric rating (e.g., 4.5)
    if (typeof rating === "string") {
      starCount = rating.length; // Count stars in string (e.g., "*****" = 5)
    } else {
      starCount = parseFloat(rating) || 0; // Parse numeric rating or default to 0
    }

    const fullStars = Math.floor(starCount); // Number of full stars
    const hasHalfStar = starCount % 1 >= 0.5; // Half star if decimal >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Remaining empty stars

    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar
            key={`full-${i}`}
            className="text-[#2D7B67] w-3 h-3 sm:w-4 sm:h-4"
          />
        ))}
        {hasHalfStar && (
          <FaStarHalfAlt className="text-[#2D7B67] w-3 h-3 sm:w-4 sm:h-4" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar
            key={`empty-${i}`}
            className="text-[#2D7B67] w-3 h-3 sm:w-4 sm:h-4"
          />
        ))}
      </div>
    );
  };

  return (
    <div
      className="w-full max-w-[24rem] sm:max-w-[25rem] bg-white border border-gray-300 rounded-xl relative flex justify-center shadow-sm hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/institute-overview/${institute.id}`)}
    >
      <div className="w-full h-auto flex flex-col">
        {/* Image Section */}
        <div className="w-full aspect-[4/3] px-2 py-2 sm:px-3 sm:py-3">
          <img
            src={institute.image || assets.coaching}
            alt={`Coaching - ${institute.name}`}
            className="w-full h-full object-cover rounded-xl"
            loading="lazy"
          />
        </div>

        {/* Content Section */}
        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 mb-5">
          {/* Title + Rating */}
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-base sm:text-lg md:text-xl text-gray-900">
              {institute.name || "Unnamed Institute"}
            </h2>
            <div className="text-[#204B55] text-xs sm:text-base font-medium">
              {renderStars(institute.rating)}
            </div>
          </div>

          <div className="flex items-start justify-between">
            {/* Address */}
            <div className="flex items-start gap-1 text-gray-700">
              <FaLocationDot className="text-[#204B55] w-3 h-3 sm:w-4 sm:h-4 shrink-0 mt-0.5" />
              <p className="leading-tight text-[0.65rem] sm:text-xs">
                {institute.address || "No address available"}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-row gap-1">
              {(institute.tags || ["JEE", "XII Boards", "X Boards"]).map(
                (tag) => (
                  <span
                    key={tag}
                    className="bg-[#E6EDE2] text-gray-800 px-1 sm:px-1.5 py-0.5 text-[0.6rem] sm:text-xs rounded-full hover:bg-[#d7e0d5] transition whitespace-nowrap"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <button className="absolute -bottom-5 flex flex-row items-center justify-center rounded-lg gap-1 sm:gap-2 bg-[#E6EDE2] px-3 py-1.5 sm:px-4 sm:py-2">
        <BsChatTextFill className="text-[#204B55] w-4 h-4 sm:w-5 sm:h-5" />
        <span className="text-sm sm:text-base font-medium">Enquire Now</span>
      </button>
    </div>
  );
};

export default Card;
