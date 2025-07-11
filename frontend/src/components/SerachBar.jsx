import React, { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { Search } from "lucide-react"; // Assuming Search is from lucide-react
import { useNavigate } from "react-router-dom";
import { RectangleIcon } from "./RectangleIcon.jsx"; // Your custom RectangleIcon component

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      // Redirect to institutes-on-location page with query as a URL parameter
      navigate(`/institutes-on-location?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="flex flex-col h-16 sm:h-20 sm:flex-row items-center justify-between mt-6 sm:mt-10 w-full max-w-md md:max-w-lg lg:max-w-4xl mx-auto shadow-custom border border-[#000000] rounded-full overflow-hidden">
      {/* Left: Location Icon + Input */}
      <div className="flex items-center gap-2 px-6 py-2 w-full mt-3 sm:mt-0">
        <FaLocationDot className="text-green-700 text-xl sm:text-2xl md:text-3xl" />
        <input
          type="text"
          placeholder="Search by Coaching, Course, Domain, location..."
          className="outline-none bg-[#FFFFFF] w-full text-gray-700 placeholder-[#000] placeholder-opacity-90
             text-sm sm:text-base
             placeholder:text-sm sm:placeholder:text-base
              rounded-md"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>

      {/* Right: SearchBanner */}
      <div className="relative h-full w-full flex items-center justify-center px-6 py-2">
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
            height={170}
            width={62}
            color="#AAD294"
            className="absolute transform -rotate-[45deg] translate-x-52 min-md:translate-x-28 z-10 mix-blend-multiply hidden md:block"
          />
          {/* Search Icon */}
          <button onClick={handleSearch}>
            <Search className="absolute max-sm:bottom-3 max-sm:font-bold -bottom-2 translate-x-44 min-md:translate-x-24 size-6 text-white z-10 max-sm:text-[#204B55] max-sm:translate-x-40 cursor-pointer" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
