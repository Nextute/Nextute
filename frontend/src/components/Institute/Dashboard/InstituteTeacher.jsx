import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaSearch, FaPlus } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import SidePanel from "./SidePanel";
import TeacherCard from "./TeacherCard";
import { useInstituteData } from "../../../hooks/useInstituteData.js";
import { assets } from "../../../assets/assets.js";
import LoadingSpinner from "../../LoadingSpinner.jsx";
import Navbar from "../../Navbar.jsx";
import Footer from "../../Footer.jsx";

const InstituteTeacher = () => {
  const { instituteDashboardData, dataLoading, error, hasRenderedOnce } =
    useInstituteData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Welcome back popup
  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedTeachers");
    if (hasVisited) {
      toast(
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <h3 className="text-lg font-semibold text-[#144E53]">
              Welcome Back!
            </h3>
            <p className="text-sm text-gray-600">
              Manage your institute's teachers seamlessly.
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
    localStorage.setItem("hasVisitedTeachers", "true");
  }, []);

  // Parse faculty_details
  const facultyData = useMemo(() => {
    if (!instituteDashboardData) return [];
    try {
      return (
        JSON.parse(
          JSON.parse(instituteDashboardData.faculty_details).faculties
        ) || []
      );
    } catch (err) {
      console.error("Error parsing faculty data:", err);
      return [];
    }
  }, [instituteDashboardData]);

  // Filter teachers
  const filteredTeachers = useMemo(() => {
    return facultyData.filter(
      (teacher) =>
        `${teacher.firstName} ${teacher.middleName || ""} ${teacher.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        teacher.subject?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [facultyData, searchTerm]);

  // Paginate teachers
  const paginatedTeachers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTeachers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTeachers, currentPage]);

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

  // Loading and error states
  if (dataLoading || !hasRenderedOnce) return <LoadingSpinner />;
  if (error || !facultyData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#E6EDE2] text-red-600 text-lg sm:text-xl font-semibold">
        Error loading teacher data. Please try again.
      </div>
    );
  }

  const handleDelete = (id, name) => {
    toast(
      <div className="flex flex-col gap-3">
        <p className="text-sm sm:text-base">
          Are you sure you want to delete {name}?
        </p>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-sm"
            onClick={async () => {
              try {
                const response = await new Promise((resolve) =>
                  setTimeout(() => resolve({ ok: true }), 1000)
                );
                if (response.ok) {
                  toast.success(`${name} deleted successfully!`, {
                    position: "top-right",
                    duration: 3000,
                    style: {
                      background: "#E6EDE2",
                      color: "#144E53",
                      borderRadius: "8px",
                    },
                  });
                  navigate("/institute/teachers");
                } else {
                  throw new Error("Failed to delete teacher");
                }
              } catch (err) {
                toast.error(err.message, {
                  position: "top-right",
                  duration: 3000,
                  style: {
                    background: "#E6EDE2",
                    color: "#144E53",
                    borderRadius: "8px",
                  },
                });
              }
            }}
          >
            Confirm
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-1.5 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition-all duration-200 shadow-sm"
            onClick={() => toast.dismiss()}
          >
            Cancel
          </motion.button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        style: {
          background: "#fff",
          color: "#144E53",
          padding: "16px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        },
      }
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#e5e7e4]">
      <Navbar />
      <div className="flex flex-1">
        <SidePanel />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex-1 p-4 sm:p-6 lg:p-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4"
          >
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#144E53] tracking-tight">
              Teachers Details
            </h1>
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="relative w-full max-w-xs sm:max-w-sm"
              >
                <input
                  type="text"
                  placeholder="Search by name or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#2D7A66]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93E9A2] transition-all duration-300 shadow-sm text-sm sm:text-base"
                  aria-label="Search Teachers"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2D7A66] w-4 sm:w-5 h-4 sm:h-5" />
              </motion.div>
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/institute/facultiesdetails")}
                className="px-4 sm:px-6 py-2 bg-[#2D7A66] text-white rounded-lg shadow-md hover:bg-[#144E53] transition-all duration-300 flex items-center gap-2 text-sm sm:text-base"
                aria-label="Add New Teacher"
              >
                <FaPlus className="w-4 sm:w-5 h-4 sm:h-5" />
                Add
              </motion.button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-[#2D7A66]/10"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4 sm:gap-6">
              <AnimatePresence>
                {paginatedTeachers.length > 0 ? (
                  paginatedTeachers.map((teacher, index) => (
                    <motion.div
                      key={
                        teacher.id || `${teacher.firstName}-${teacher.contact}`
                      }
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.1,
                        ease: "easeOut",
                      }}
                    >
                      <TeacherCard
                        teacher={teacher}
                        onEdit={() =>
                          navigate(
                            `/institute/edit-teacher/${
                              teacher.id || teacher.contact
                            }`
                          )
                        }
                        onDelete={() =>
                          handleDelete(
                            teacher.id || teacher.contact,
                            `${teacher.firstName} ${teacher.lastName}`
                          )
                        }
                        onView={() =>
                          navigate(
                            `/institute/view-teacher/${
                              teacher.id || teacher.contact
                            }`
                          )
                        }
                      />
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full text-center py-8 sm:py-10"
                  >
                    <img
                      src={assets.Not_found}
                      alt="No Teachers"
                      className="mx-auto mb-4 w-24 sm:w-32 h-24 sm:h-32 opacity-60"
                      onError={(e) => (e.target.src = assets.Not_found)}
                    />
                    <p className="text-gray-700 text-sm sm:text-base mb-4">
                      No teachers found. Add a new teacher to get started!
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/institute/facultiesdetails")}
                      className="px-4 sm:px-6 py-2 bg-[#2D7A66] text-white rounded-lg shadow-md hover:bg-[#144E53] transition-all duration-300 text-sm sm:text-base"
                      aria-label="Add New Teacher"
                    >
                      Add Teacher
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex justify-center gap-2 mt-6 sm:mt-8"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <motion.button
                      key={page}
                      whileHover={{ scale: 1.1, backgroundColor: "#93E9A2" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1.5 rounded-lg text-sm sm:text-base ${
                        currentPage === page
                          ? "bg-[#2D7A66] text-white"
                          : "bg-[#E6EDE2] text-[#144E53]"
                      } transition-all duration-300 shadow-sm`}
                      aria-label={`Go to page ${page}`}
                    >
                      {page}
                    </motion.button>
                  )
                )}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default InstituteTeacher;
