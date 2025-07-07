import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { assets } from "../../assets/assets";

const RegistrationNavigation = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Navigation items with their paths
  const navItems = [
    { name: "Basic Information", path: "/institute/basic-info" },
    { name: "Contact Details", path: "/institute/contact" },
    { name: "Course Offered", path: "/institute/courses" },
    { name: "Faculties Details", path: "/institute/faculties" },
    { name: "Student Achievements", path: "/institute/student-achievements" },
    { name: "Institute Achievements", path: "/institute/institute-achievements" },
    { name: "Facilities", path: "/institute/facilities" },
    { name: "Media & Gallery", path: "/institute/media" },
    { name: "Social Media", path: "/institute/social" },
  ];

  const currentPageName = navItems.find(item => item.path === pathname)?.name || "Unknown Page";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="w-full mb-6">
      {/* Logo aligned at top with reduced margin */}
      <div className=" flex items-center justify-start">
        <img
          src={assets.logo}
          alt="Logo"
          className="w-32 h-auto object-contain"
         
        />
      </div>

      {/* Mobile menu button - only visible on small screens */}
      <div className="md:hidden flex justify-between items-center p-2 bg-gray-50 rounded-md">
        <span className="font-medium">{currentPageName}</span>
        <button
          onClick={toggleMenu}
          className="p-2 rounded-md hover:bg-gray-200 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile menu - shown when toggled on small screens */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-fit opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col space-y-2 p-2 bg-white shadow-md rounded-md mt-1">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={closeMenu}
              className={`px-4 py-2 rounded-md ${
                pathname === item.path
                  ? "bg-[#2D7A66] text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop horizontal menu - hidden on small screens, visible on medium and up */}
      <div className="hidden md:block overflow-x-auto">
        <div className="flex space-x-4 min-w-max p-2">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`px-4 py-2 rounded-md whitespace-nowrap ${
                pathname === item.path
                  ? "bg-[#2D7A66] text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default RegistrationNavigation;
