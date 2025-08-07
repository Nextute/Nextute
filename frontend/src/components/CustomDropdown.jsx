import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";

const CustomDropdown = ({ label, value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const checkDropdownPosition = () => {
      if (dropdownRef.current) {
        const rect = dropdownRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceNeeded = Math.min(options.length * 40, 240); // Approx 40px per option, max 240px
        setOpenUpward(spaceBelow < spaceNeeded && rect.top > spaceNeeded);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", checkDropdownPosition);
    window.addEventListener("scroll", checkDropdownPosition);

    if (isOpen) {
      checkDropdownPosition();
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", checkDropdownPosition);
      window.removeEventListener("scroll", checkDropdownPosition);
    };
  }, [isOpen, options.length]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      setIsOpen(!isOpen);
    }
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-sm sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">
        {label}
      </label>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        ref={inputRef}
        className="w-full flex justify-between items-center px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg bg-white text-gray-900 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2D7A67] transition-all duration-200 hover:border-[#2D7A67]"
        aria-expanded={isOpen}
        aria-label={`Select ${label}`}
      >
        <span className="text-sm sm:text-base truncate">
          {value || placeholder}
        </span>
        <span className="ml-2 text-[#2D7A67]">
          {isOpen ? <HiChevronUp size={20} /> : <HiChevronDown size={20} />}
        </span>
      </motion.div>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: openUpward ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: openUpward ? 10 : -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute z-20 w-full max-w-96 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg ${
              openUpward ? "bottom-full mb-1" : "top-full mt-1"
            }`}
            role="listbox"
            aria-activedescendant={value}
          >
            {options.map((option, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                  inputRef.current.focus();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    onChange(option);
                    setIsOpen(false);
                    inputRef.current.focus();
                  }
                }}
                tabIndex={0}
                className="px-3 sm:px-4 py-2 hover:bg-[#2D7A67] hover:text-white cursor-pointer text-sm sm:text-base transition-colors duration-200"
                role="option"
                aria-selected={value === option}
              >
                {option}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomDropdown;
