import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";
import { useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const {
    isAuthenticated,
    setShowLogin,
    setShowSignup,
    user,
    userType,
    logout,
  } = useContext(AppContext);

  // console.log("📥 user in navbar:", user);
  // console.log("📦 User type set to navbar:", userType);

  // console.log("Header render →", {
  //   isAuthenticated,
  //   user,
  // });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();

  const dropdownRef = useRef(null);
  const profileButtonRef = useRef(null);

  useEffect(() => {
    setIsDropdownOpen(false);
    setShowMenu(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full bg-[#f2fffc] bg-opacity-60 shadow-lg border-b border-gray-200 mb-5 sm:mb-10"
    >
    <div className="w-full max-w-[94rem] h-24 mx-auto flex items-center justify-between py-4 px-4 sm:px-8 relative">
      <NavLink to="/">
        <img
          src={assets.logo}
          alt="Nextute Logo"
          className="w-28 sm:w-32 lg:w-40"
        />
      </NavLink>

      <nav className="hidden md:flex items-center gap-6">
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
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-center w-11 h-11 rounded-full border border-gray-500 hover:bg-gray-100 transition"
              disabled={isLoggingOut}
              ref={profileButtonRef}
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

            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10"
              >
                <NavLink
                  to={`/${userType}/dashboard`}
                  className="block px-4 py-2 text-gray-700 hover:bg-[#2D7B67] hover:text-white transition"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to={`/support`}
                  className="block px-4 py-2 text-gray-700 hover:bg-[#2D7B67] hover:text-white transition"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Support
                </NavLink>
                <button
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-[#2D7B67] hover:text-white transition"
                  onClick={() => {
                    handleLogout();
                    setIsDropdownOpen(false);
                  }}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button
              className="text-gray-700 px-6 py-2 border border-gray-500 rounded-full hover:bg-gray-50 transition"
              onClick={() => {
                setShowLogin(true);
                setShowSignup(false);
              }}
            >
              Login
            </button>
            <button
              className="bg-[#2D7B67] text-white px-6 py-2 rounded-full hover:bg-[#1F4C56] transition"
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

      <img
        src={assets.menu_icon}
        alt="menu-icon"
        onClick={() => setShowMenu(true)}
        className="w-6 md:hidden cursor-pointer"
      />

      <div
        className={`fixed inset-0 z-30 bg-white transition-transform duration-300 md:hidden ${
          showMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-6 border-b">
          <img src={assets.logo} alt="logo" className="w-28" />
          <img
            src={assets.cross_icon}
            alt="close"
            onClick={() => setShowMenu(false)}
            className="w-6 h-6 cursor-pointer"
          />
        </div>

        <div className="overflow-y-auto h-[calc(100%-80px)] px-6 py-4 flex flex-col gap-4 text-base font-medium">
          <NavLink onClick={() => setShowMenu(false)} to="/">
            <p className="py-2">Home</p>
          </NavLink>
          <NavLink onClick={() => setShowMenu(false)} to="/about">
            <p className="py-2">About Us</p>
          </NavLink>
          <NavLink onClick={() => setShowMenu(false)} to="/services">
            <p className="py-2">Services</p>
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink
                onClick={() => setShowMenu(false)}
                to={`/${userType}/dashboard`}
              >
                <p className="py-2">Dashboard</p>
              </NavLink>
              <NavLink
                onClick={() => setShowMenu(false)}
                to={`/support`}
              >
                <p className="py-2">Support</p>
              </NavLink>
              <button
                className="text-left py-2 text-gray-700"
                onClick={() => {
                  handleLogout();
                  setShowMenu(false);
                }}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <button
                className="text-gray-700 py-2 border border-gray-500 rounded-full w-full text-center"
                onClick={() => {
                  setShowLogin(true);
                  setShowSignup(false);
                  setShowMenu(false);
                }}
              >
                Login
              </button>
              <button
                className="bg-[#2D7B67] text-white py-2 rounded-full w-full text-center"
                onClick={() => {
                  setShowSignup(true);
                  setShowLogin(false);
                  setShowMenu(false);
                }}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
    </motion.nav>
  );
};

export default Navbar;
