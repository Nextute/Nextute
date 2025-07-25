import { cities } from "../assets/assets.js";
import SearchBar from "./SearchBar.jsx";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  // Typewriter effect state
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const phrases = ["10+ Cities", "100+ Institutes", "1000+ Courses"];
  const navigate = useNavigate();

  // Typewriter effect logic
  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];

      setText(
        isDeleting
          ? fullText.substring(0, text.length - 1)
          : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 75 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, phrases]);

  // Navigation handler for city clicks
  const handleCityClick = (cityName, isLast) => {
    if (isLast) {
      navigate("/institutes-on-location");
    } else {
      navigate(`/search?city=${encodeURIComponent(cityName)}`);
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Heading and Subheading */}
      <div className="flex flex-col text-center">
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-[#002639]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Search Across <span className="text-[#204B55]">"{text}"</span>
          <span className="text-[#204B55] animate-blink">|</span>
        </motion.h2>
        <motion.p
          className="text-base sm:text-lg md:text-xl text-[#002639] font-normal mt-4 mx-auto max-w-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          We don't just prepare you for exams - we prepare you for life
        </motion.p>
      </div>

      {/* Search Bar */}
      <SearchBar />

      {/* Cities Images */}
      <div className="flex flex-row items-center gap-4 sm:gap-6 mt-8 sm:mt-12 overflow-x-auto scrollbar-hide px-4 w-full max-w-5xl mx-auto">
        {cities.map((city, index) => {
          const isLast = index === cities.length - 1;
          return (
            <motion.div
              key={city.id}
              className="flex-shrink-0 flex flex-col items-center text-center relative group"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
            >
              {/* Image */}
              <img
                src={city.src}
                alt={city.alt}
                onClick={() => handleCityClick(city.name, isLast)}
                className="cursor-pointer h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-28 lg:w-28 object-cover rounded-full border-2 border-[#204B55] shadow-md"
                role="button"
                aria-label={
                  isLast
                    ? "View more cities"
                    : `Search institutes in ${city.name}`
                }
                style={
                  isLast
                    ? {
                        backdropFilter: "blur(3.1px)",
                        background: "rgba(255, 255, 255, 0.51)",
                        filter: "blur(3.1px)",
                      }
                    : {}
                }
              />

              {/* Name or "More" Overlay */}
              <p
                className={`mt-2 text-[#204B55] font-medium text-xs sm:text-sm ${
                  isLast ? "hidden" : ""
                }`}
              >
                {city.name}
              </p>

              {/* More Text Overlay for last image */}
              {isLast && (
                <span className="absolute inset-0 flex items-center justify-center underline text-black font-semibold text-xs sm:text-sm md:text-base">
                  More...
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Header;
