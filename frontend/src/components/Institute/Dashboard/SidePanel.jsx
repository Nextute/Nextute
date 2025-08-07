import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Image,
  LogOut,
  BookOpen,
} from "lucide-react";
import { FaLink } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { AppContext } from "../../../context/AppContext";

const SidePanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const { logout } = useContext(AppContext);

  const handleLogout = async () => {
    if (logoutLoading) return;
    setLogoutLoading(true);
    try {
      await logout();
      toast.success("Logged out successfully!", {
        position: "top-right",
        duration: 2000,
        style: {
          background: "#E6EDE2",
          color: "#144E53",
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        },
      });
      navigate("/");
    } catch (err) {
      toast.error("Failed to log out", {
        position: "top-right",
        duration: 2000,
        style: {
          background: "#E6EDE2",
          color: "#144E53",
          borderRadius: "8px",
        },
      });
    } finally {
      setLogoutLoading(false);
    }
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      route: "/institute/dashboard",
    },
    {
      id: "teachers",
      label: "Teachers",
      icon: <GraduationCap className="w-5 h-5" />,
      route: "/institute/teachers",
    },
    {
      id: "batches",
      label: "Batches",
      icon: <Users className="w-5 h-5" />,
      route: "/institute/batches",
    },
    {
      id: "media",
      label: "Media & Photo",
      icon: <Image className="w-5 h-5" />,
      route: "/institute/photos-and-videos",
    },
    {
      id: "social-media",
      label: "Social Media",
      icon: <FaLink className="w-5 h-5" />,
      route: "/institute/edit-social-media",
    },
    {
      id: "logout",
      label: "Logout",
      icon: <LogOut className="w-5 h-5" />,
      action: handleLogout,
    },
  ];

  // Close sidebar on route change for mobile screens
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  // Handle window resize to control sidebar visibility
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true); // Sidebar always open on larger screens
      } else {
        setIsOpen(false); // Sidebar closed by default on mobile
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: "-100%", opacity: 0 },
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="relative md:hidden">
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isOpen ? 0 : 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="absolute -top-3 left-4 z-50 w-6 h-6  text-[#2D7A66] shadow-md hover:text-[#144E53] transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#93E9A2]"
          onClick={() => setIsOpen(true)}
          aria-label="Open Sidebar"
        >
          <BookOpen className="w-6 h-6 mx-auto" />
        </motion.button>
      </div>

      {/* Sidebar */}
      <motion.div
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-40 md:static md:z-auto md:w-64 border-r border-[#2D7A66]/10 ${
          isOpen ? "block" : "hidden md:block"
        }`}
        aria-label="Sidebar Navigation"
      >
        <div className="p-4 bg-gradient-to-b from-[#2D7A66] to-[#144E53] flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Institute
          </h2>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden text-white focus:outline-none focus:ring-2 focus:ring-[#93E9A2] rounded-full"
            onClick={() => setIsOpen(false)}
            aria-label="Close Sidebar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.button>
        </div>

        <div className="flex flex-col gap-1 p-4">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else {
                  navigate(item.route);
                  if (window.innerWidth < 768) {
                    setIsOpen(false);
                  }
                }
              }}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 hover:bg-[#93E9A2] hover:text-[#144E53] ${
                location.pathname.toLowerCase() === item.route?.toLowerCase()
                  ? "bg-[#93E9A2] text-[#144E53] font-semibold"
                  : "text-gray-700"
              } focus:outline-none focus:ring-2 focus:ring-[#2D7A66]`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (item.action) {
                    item.action();
                  } else {
                    navigate(item.route);
                    if (window.innerWidth < 768) {
                      setIsOpen(false);
                    }
                  }
                }
              }}
              aria-label={`Navigate to ${item.label}`}
            >
              <span className="w-8 h-8 flex items-center justify-center">
                {item.icon}
              </span>
              <span className="text-sm sm:text-base font-medium">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Overlay for Mobile */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-60 md:hidden z-30"
          onClick={() => setIsOpen(false)}
          aria-label="Close Sidebar Overlay"
        />
      )}
    </>
  );
};

export default SidePanel;
