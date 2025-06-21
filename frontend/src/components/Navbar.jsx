import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";


const Navbar = () => {
  const {
    isAuthenticated,
    setShowLogin,
    setShowSignup,
    user,
    authToken,
    logout,
  } = useContext(AppContext);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    // Update isAuthenticated based on authToken and user
    isAuthenticated;
    console.log("navbar", isAuthenticated);
  }, [authToken, user]);

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/students/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (response.ok) {
        logout(); // Clear cookies and context state
        toast.success("Logged out successfully");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };

  return (
    <div className="w-full h-32 mx-auto mb-4 flex items-center justify-between py-4">
      {/* Logo */}
      <NavLink to="/">
        <img
          src={assets.logo}
          alt="Nextute Logo"
          className="w-28 sm:w-32 lg:w-40 ml-14"
        />
      </NavLink>

      {/* RIGHT SECTION -> NAV LINKS */}
      <nav className="flex items-center gap-6 mr-16">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active-nav-link" : ""}`
          }
        >
          <p>Home</p>
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active-nav-link" : ""}`
          }
        >
          <p>About Us</p>
        </NavLink>

        <NavLink
          to="/services"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active-nav-link" : ""}`
          }
        >
          <p>Services</p>
        </NavLink>
        {isAuthenticated ? (
          <div className="relative">
            {/* Profile Photo or User Icon */}
            <button
              onClick={toggleDropdown}
              className="flex items-center justify-center w-11 h-11 rounded-full border border-gray-500 hover:bg-gray-100 transition duration-300"
            >
              {user?.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <img
                  src={assets.upload_area}
                  alt="profile icon"
                  className="w-full h-full rounded-full object-cover"
                />
              )}
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                <NavLink
                  to="/student/dashboard"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-gray-700 hover:bg-[#2D7B67] hover:text-white transition duration-300 ${
                      isActive ? "bg-[#1F4C56] text-white" : ""
                    }`
                  }
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/student/settings"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-gray-700 hover:bg-[#2D7B67] hover:text-white transition duration-300 ${
                      isActive ? "bg-[#1F4C56] text-white" : ""
                    }`
                  }
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Settings
                </NavLink>
                <button
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-[#2D7B67] hover:text-white transition duration-300"
                  onClick={() => {
                    handleLogout();
                    setIsDropdownOpen(false);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button
              className="text-gray-700 px-7 py-2 cursor-pointer border border-gray-500 rounded-full hover:bg-gray-50 transition duration-300"
              onClick={() => {
                setShowLogin(true);
                setShowSignup(false);
              }}
            >
              Login
            </button>
            <button
              className="bg-[#2D7B67] text-white px-7 py-2 cursor-pointer border border-gray-500 rounded-full hover:bg-[#1F4C56] transition duration-300"
              onClick={() => {
                setShowSignup(true);
                setShowLogin(false);
              }}
            >
              Sign Up
            </button>
          </>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
