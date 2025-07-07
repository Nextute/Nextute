import { FaLocationDot } from "react-icons/fa6";
import { assets, cities } from "../assets/assets.js";
import { Search } from "lucide-react";
import { RectangleIcon } from "./RectangleIcon.jsx";
import SearchBar from "./SerachBar.jsx";

const Header = () => {
  return (
    <div className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-8">
      {/* Heading and Subheading */}
      <div className="flex flex-col text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-[#002639]">
          Search Across <span className="text-[#204B55]">‘10+ Cities’</span>
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-[#002639] font-normal mt-4 mx-auto max-w-3xl">
          We don’t just prepare you for exams - we prepare you for life
        </p>
      </div>

      {/* Search Bar */}
      <SearchBar />

      {/* Cities Images */}
      <div className="flex flex-row items-center gap-4 sm:gap-6 mt-8 sm:mt-12 overflow-x-auto scrollbar-hide px-4 w-full max-w-5xl mx-auto">
        {cities.map((city, index) => (
          <div
            key={city.id}
            className="flex-shrink-0 flex flex-col items-center text-center relative group"
          >
            {/* Image */}
            <img
              src={city.src}
              alt={city.alt}
              className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-28 lg:w-28 object-cover rounded-full border-2 border-[#204B55] shadow-md"
              style={
                index === cities.length - 1
                  ? {
                      backdropFilter: "blur(3.1px)",
                      background: "#FFFFFF82",
                      filter: "blur(3.1px)",
                    }
                  : {}
              }
            />

            {/* Name or "More" Overlay */}
            <p
              className={`mt-2 text-[#204B55] font-medium text-xs sm:text-sm ${
                index === cities.length - 1 ? "hidden" : ""
              }`}
            >
              {city.name}
            </p>

            {/* More Text Overlay for last image */}
            {index === cities.length - 1 && (
              <span className="absolute inset-0 flex items-center justify-center underline text-black font-semibold text-xs sm:text-sm md:text-base">
                More...
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Header;
