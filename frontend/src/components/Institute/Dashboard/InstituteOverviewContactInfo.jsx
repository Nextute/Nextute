import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaAddressBook,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import axios from "axios";

const InstituteOverviewContactInfo = ({ id }) => {
  const [contact, setContact] = useState(null);
  const [error, setError] = useState("");

  // Welcome back popup for returning users
  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedContactInfo");
    if (hasVisited) {
      toast(
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <h3 className="text-lg font-semibold text-[#144E53]">
              Welcome Back!
            </h3>
            <p className="text-sm text-gray-600">
              View and manage your institute's contact information.
            </p>
          </div>
        </div>,
        {
          duration: 3000,
          position: "top-center",
          style: {
            background: "#E6EDE2",
            color: "#144E53",
            borderRadius: "12px",
            padding: "16px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          },
        }
      );
    }
    localStorage.setItem("hasVisitedContactInfo", "true");
  }, []);

  // Fetch contact info
  useEffect(() => {
    if (!id) return;

    const fetchContactInfo = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/institutes/${id}`
        );
        if (res.data?.status) {
          const data = res.data.data;
          setContact({
            phone: data.contact,
            email: data.email,
            address: data.contact_details?.headOffice?.address,
          });
        } else {
          setError("Invalid response received.");
        }
      } catch (err) {
        setError("Failed to load contact information.");
      }
    };

    fetchContactInfo();
  }, [id]);

  if (!id) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-red-500 text-center p-4 text-sm sm:text-base font-semibold bg-white bg-opacity-95 rounded-lg shadow-md border border-red-200"
      >
        Error: Institute ID is missing.
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-red-500 text-center p-4 text-sm sm:text-base font-semibold bg-white bg-opacity-95 rounded-lg shadow-md border border-red-200"
      >
        {error}
      </motion.div>
    );
  }

  if (!contact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center text-gray-700 p-4 text-sm sm:text-base bg-white bg-opacity-95 rounded-lg shadow-md border border-[#2D7A66]/10"
      >
        Loading contact information...
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white bg-opacity-95 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 max-w-md mx-auto sm:mx-0 border border-[#2D7A66]/10"
    >
      <div className="flex flex-col items-center text-center mb-4 sm:mb-6">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="text-3xl sm:text-4xl text-[#2D7A66] mb-2"
        >
          <FaAddressBook />
        </motion.div>
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#144E53] tracking-tight">
          Contact Info
        </h2>
      </div>
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex justify-between items-start border-t border-[#2D7A66]/20 pt-4"
        >
          <div className="flex gap-2 sm:gap-3 items-center">
            <FaPhoneAlt className="text-[#2D7A66] text-lg sm:text-xl" />
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-[#144E53]">
                Phone Number
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 truncate">
                {contact.phone || "N/A"}
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-xs sm:text-sm text-[#2D7A66] hover:text-[#144E53] underline transition-colors"
            aria-label="Edit Phone Number"
          >
            Edit
          </motion.button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex justify-between items-start border-t border-[#2D7A66]/20 pt-4"
        >
          <div className="flex gap-2 sm:gap-3 items-center">
            <FaEnvelope className="text-[#2D7A66] text-lg sm:text-xl" />
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-[#144E53]">
                Email Address
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 truncate">
                {contact.email || "N/A"}
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-xs sm:text-sm text-[#2D7A66] hover:text-[#144E53] underline transition-colors"
            aria-label="Edit Email Address"
          >
            Edit
          </motion.button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="flex justify-between items-start border-t border-[#2D7A66]/20 pt-4"
        >
          <div className="flex gap-2 sm:gap-3 items-center">
            <FaMapMarkerAlt className="text-[#2D7A66] text-lg sm:text-xl" />
            <p className="text-xs sm:text-sm text-gray-700 max-w-xs line-clamp-2">
              {contact.address || "N/A"}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-xs sm:text-sm text-[#2D7A66] hover:text-[#144E53] underline transition-colors whitespace-nowrap"
            aria-label="Edit Address"
          >
            Edit
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default InstituteOverviewContactInfo;
