
import { useNavigate } from "react-router-dom";
import { FaPhoneAlt, FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa";
import { BsChatTextFill } from "react-icons/bs";
import { assets } from "../assets/assets";

const HorizontalCard = ({ id, name, address, tags, contact, image }) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col md:flex-row items-start bg-white border border-gray-300 rounded-2xl shadow-sm max-w-2xl sm:max-w-3xl w-full mx-auto my-2 sm:my-4 hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/institute/overview/${id}`)}
    >
      <div className="w-full md:w-5/12 aspect-[4/3] p-2 sm:p-3">
        <img
          src={image || assets.coaching}
          alt="Institute"
          className="w-full h-full object-cover rounded-2xl"
          loading="lazy"
        />
      </div>

      <div className="p-3 sm:p-4 md:p-5 flex-1 relative">
        <div className="flex flex-row justify-between items-center mb-2 sm:mb-3">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
            {name}
          </h2>
          <div className="text-[#2D7B67] text-sm sm:text-2xl">
            {"★".repeat(5)}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="flex items-start text-gray-700">
            <FaMapMarkerAlt className="mt-0.5 mr-1.5 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5 text-[#2D7B67] shrink-0" />
            <p className="text-xs sm:text-sm leading-tight">
              {address || "Not Available"}
            </p>
          </div>

          <div className="flex flex-wrap gap-1 sm:gap-2">
            {(tags || []).map((tag, index) => (
              <span
                key={index}
                className="bg-[#E6EDE2] text-[0.65rem] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg hover:bg-[#d7e0d5] transition"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
          <button className="flex items-center gap-1 sm:gap-2 border border-gray-300 rounded-xl px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm hover:bg-[#E6EDE2] transition">
            <FaPhoneAlt className="text-[#2D7B67] w-3 h-3 sm:w-4 sm:h-4" />
            {contact || "+91 91234 56789"}
          </button>
          <button className="flex items-center gap-1 sm:gap-2 border border-gray-300 rounded-xl px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm hover:bg-[#E6EDE2] transition">
            <FaWhatsapp className="text-[#2D7B67] w-3 h-3 sm:w-4 sm:h-4" />
            Whatsapp
          </button>
        </div>

        <div className="absolute -bottom-3 right-3 sm:right-4">
          <button className="flex items-center gap-1 sm:gap-2 bg-[#E6EDE2] text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg hover:bg-[#d7e0d5] transition">
            <BsChatTextFill className="w-4 h-4 sm:w-5 sm:h-5 text-[#2D7B67]" />
            Enquiry →
          </button>
        </div>
      </div>
    </div>
  );
};

export default HorizontalCard;
