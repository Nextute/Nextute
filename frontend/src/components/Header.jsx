import { FaLocationDot } from "react-icons/fa6";
import { assets, cities } from "../assets/assets.js";
import { Search } from "lucide-react";
import { RectangleIcon } from "./RectangleIcon.jsx";

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
      <div className="flex flex-col h-16 sm:h-20 sm:flex-row items-center justify-between mt-6 sm:mt-10 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-4xl mx-auto shadow-custom border border-[#000000] rounded-full overflow-hidden">
        {/* Left: Location Icon + Input */}
        <div className="flex items-center gap-2 px-6 py-2 w-full mt-3 sm:mt-0">
          <FaLocationDot className="text-green-700 text-xl sm:text-2xl md:text-3xl" />
          <input
            type="text"
            placeholder="Search by location..."
            className="outline-none bg-[#FFFFFF] w-full text-gray-700 text-lg sm:text-2xl placeholder-[#000] placeholder-opacity-90 placeholder:text-base sm:placeholder:text-lg md:placeholder:text-xl lg:placeholder:text-2xl"
          />
        </div>

        {/* Right: SearchBanner */}
        <div className="relative h-full w-full flex items-center justify-center px-6 py-2">
          {/* Background Rectangles */}
          <div className="relative flex items-center justify-center">
            {/* First Rectangle (45° rotation) */}
            <RectangleIcon
              height={190}
              width={75}
              color="#204B55"
              className="absolute transform rotate-45 translate-x-52 min-md:translate-x-28 z-10 mix-blend-multiply hidden md:block"
            />
            {/* Second Rectangle (-45° rotation) */}
            <RectangleIcon
              height={160}
              width={50}
              color="#AAD294"
              className="absolute transform -rotate-45 translate-x-52 min-md:translate-x-28 z-10 mix-blend-multiply hidden md:block"
            />
            <img
              src={assets.filter}
              alt="Filter Icon"
              className="size-6 translate-x-20 min-md:translate-x-5 cursor-pointer hidden md:block"
            />
            {/* Search Icon */}
            <Search className="absolute translate-x-48 min-md:translate-x-24 size-6 text-white z-50 max-sm:text-[#204B55] max-sm:translate-x-32 max-sm:-top-10" />
          </div>
        </div>
      </div>

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
