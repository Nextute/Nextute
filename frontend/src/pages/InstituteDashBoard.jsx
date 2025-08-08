import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import SidePanel from "../components/Institute/Dashboard/SidePanel";
import SummaryCard from "../components/Institute/Dashboard/SummaryCard";
import AchievementCard from "../components/Institute/Dashboard/AchievementCard";
import SocialMediaLink from "../components/Institute/Dashboard/SocialMediaLink";
import { useInstituteData } from "../hooks/useInstituteData.js";
import {
  FaSchool,
  FaBuilding,
  FaTrophy,
  FaPhone,
  FaEnvelope,
  FaBook,
  FaChalkboardTeacher,
  FaChalkboard,
  FaClipboardCheck,
  FaLaptop,
  FaVideo,
  FaHospital,
  FaLink,
  FaUsers,
  FaImages,
} from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { assets } from "../assets/assets.js";

const InstituteDashboard = () => {
  const { instituteDashboardData, dataLoading, error, hasRenderedOnce } =
    useInstituteData();
  const navigate = useNavigate();

  console.log("Raw data:", instituteDashboardData);

  // Welcome back popup for returning users
  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedDashboard");
    if (hasVisited) {
      toast(
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <h3 className="text-lg font-semibold text-[#144E53]">
              Welcome Back!
            </h3>
            <p className="text-sm text-gray-600">
              Great to see you again! Explore your institute's dashboard.
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
    localStorage.setItem("hasVisitedDashboard", "true");
  }, []);

  console.log("instituteDashboardData:", instituteDashboardData);

  // Utility function to safely parse JSON
  const safeParseJSON = (jsonString, defaultValue) => {
    try {
      return jsonString ? JSON.parse(jsonString) : defaultValue;
    } catch (e) {
      console.error("JSON parsing error:", e);
      return defaultValue;
    }
  };

  // Check if instituteDashboardData is valid before parsing
  const instituteData =
    instituteDashboardData &&
    typeof instituteDashboardData === "object" &&
    !Array.isArray(instituteDashboardData) &&
    instituteDashboardData.basic_info
      ? {
          basic_info: safeParseJSON(instituteDashboardData.basic_info, {}),
          contact: instituteDashboardData.contact || "",
          email: instituteDashboardData.email || "",
          contact_details: safeParseJSON(
            instituteDashboardData.contact_details,
            {}
          ),
          courses: safeParseJSON(instituteDashboardData.courses, {
            courses: [],
          }),
          facilities: safeParseJSON(instituteDashboardData.facilities, {}),
          institute_achievements: safeParseJSON(
            instituteDashboardData.institute_achievements,
            { achievements: [] }
          ),
          student_achievements: safeParseJSON(
            instituteDashboardData.student_achievements,
            { achievements: [] }
          ),
          social_media: safeParseJSON(instituteDashboardData.social_media, {
            socialMedia: {},
          }),
        }
      : null;

  // Loading and error states
  if (dataLoading || !hasRenderedOnce) {
    return <LoadingSpinner />;
  }

  if (error || !instituteData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 text-red-600 text-lg sm:text-xl font-semibold">
        Error loading data or no data available. Please try again.
      </div>
    );
  }

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`, {
      position: "top-right",
      duration: 2000,
      style: {
        background: "#E6EDE2",
        color: "#144E53",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      },
    });
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
        {/* Side Panel */}
        <SidePanel />
        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white bg-opacity-95 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-[#2D7A66]/10"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <motion.img
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  src={instituteData.basic_info.logo || assets.upload_area}
                  alt={`${
                    instituteData.basic_info.institute_name || "Institute"
                  } Logo`}
                  className="w-20 sm:w-24 lg:w-32 rounded-xl object-contain border border-[#2D7A66]/20 shadow-sm"
                  onError={(e) => (e.target.src = assets.Not_found)}
                />
                <div className="text-center sm:text-left">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#144E53] tracking-tight">
                    {instituteData.basic_info.institute_name || "N/A"}
                  </h1>
                  <p className="text-sm sm:text-base text-[#2D7A66] italic mt-1 sm:mt-2">
                    {instituteData.basic_info.motto || "N/A"}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Established:{" "}
                    {instituteData.basic_info.establishedYear || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap justify-center sm:justify-end gap-2 sm:gap-3">
                {[
                  {
                    label: "Teachers",
                    link: "/institute/teachers",
                    icon: <FaChalkboardTeacher />,
                  },
                  {
                    label: "Batches",
                    link: "/institute/batches",
                    icon: <FaUsers />,
                  },
                  {
                    label: "Media",
                    link: "/institute/photos-and-videos",
                    icon: <FaImages />,
                  },
                ].map((link, index) => (
                  <motion.button
                    key={index}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(link.link)}
                    className="px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-[#2D7A66] to-[#144E53] text-white rounded-lg shadow-md hover:from-[#144E53] hover:to-[#2D7A66] transition-all duration-300 flex items-center gap-2 text-xs sm:text-sm"
                    aria-label={link.label}
                  >
                    {link.icon}
                    <span className="hidden sm:inline">{link.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Summary Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
          >
            {[
              {
                title: "Courses Offered",
                value: instituteData.courses.courses?.length || 0,
                icon: (
                  <FaSchool className="text-[#2D7A66] w-6 sm:w-8 h-6 sm:h-8" />
                ),
              },
              {
                title: "Facilities",
                value: Object.values(instituteData.facilities).filter(
                  (v) => v === "Yes" || (typeof v === "string" && v.trim())
                ).length,
                icon: (
                  <FaBuilding className="text-[#2D7A66] w-6 sm:w-8 h-6 sm:h-8" />
                ),
              },
              {
                title: "Institute Achievements",
                value:
                  instituteData.institute_achievements.achievements?.length ||
                  0,
                icon: (
                  <FaTrophy className="text-[#2D7A66] w-6 sm:w-8 h-6 sm:h-8" />
                ),
              },
              {
                title: "Student Achievements",
                value:
                  instituteData.student_achievements.achievements?.length || 0,
                icon: (
                  <FaTrophy className="text-[#2D7A66] w-6 sm:w-8 h-6 sm:h-8" />
                ),
              },
            ].map((card, index) => (
              <SummaryCard
                key={index}
                title={card.title}
                value={card.value}
                icon={card.icon}
              />
            ))}
          </motion.div>

          {/* Institute Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="bg-white bg-opacity-95 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-[#2D7A66]/10"
          >
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#144E53] mb-4 sm:mb-6">
              Institute Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-[#2D7A66] mb-2">
                  Description
                </h3>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  {instituteData.basic_info.description ||
                    "No description available"}
                </p>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-[#2D7A66] mb-2">
                  Exams Covered
                </h3>
                <p className="text-gray-700 text-sm sm:text-base">
                  {instituteData.basic_info.exams?.join(", ") || "N/A"}
                </p>
                <h3 className="text-base sm:text-lg font-semibold text-[#2D7A66] mt-4 mb-2">
                  Medium
                </h3>
                <p className="text-gray-700 text-sm sm:text-base capitalize">
                  {instituteData.basic_info.medium || "N/A"}
                </p>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-[#2D7A66] mb-2">
                  Contact Details
                </h3>
                <p className="text-gray-700 text-sm sm:text-base flex items-center gap-2">
                  <FaPhone className="text-[#2D7A66] w-4 sm:w-5 h-4 sm:h-5" />
                  <span
                    className="cursor-pointer hover:text-[#144E53] transition-colors duration-200"
                    onClick={() =>
                      handleCopy(instituteData.contact || "N/A", "Phone Number")
                    }
                  >
                    {instituteData.contact || "N/A"}
                  </span>
                </p>
                <p className="text-gray-700 text-sm sm:text-base flex items-center gap-2 mt-2">
                  <FaEnvelope className="text-[#2D7A66] w-4 sm:w-5 h-4 sm:h-5" />
                  <span
                    className="cursor-pointer hover:text-[#144E53] transition-colors duration-200"
                    onClick={() =>
                      handleCopy(instituteData.email || "N/A", "Email")
                    }
                  >
                    {instituteData.email || "N/A"}
                  </span>
                </p>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-[#2D7A66] mb-2">
                  Branch & Head Office
                </h3>
                <p className="text-gray-700 text-sm sm:text-base">
                  <strong>Branch:</strong>{" "}
                  {instituteData.contact_details.branch
                    ? `${
                        instituteData.contact_details.branch.address || "N/A"
                      }, ${
                        instituteData.contact_details.branch.city || "N/A"
                      }, ${
                        instituteData.contact_details.branch.state || "N/A"
                      } - ${
                        instituteData.contact_details.branch.pinCode || "N/A"
                      }`
                    : "N/A"}
                </p>
                <p className="text-gray-700 text-sm sm:text-base mt-2">
                  <strong>Head Office:</strong>{" "}
                  {instituteData.contact_details.headOffice
                    ? `${
                        instituteData.contact_details.headOffice.address ||
                        "N/A"
                      }, ${
                        instituteData.contact_details.headOffice.city || "N/A"
                      }, ${
                        instituteData.contact_details.headOffice.state || "N/A"
                      } - ${
                        instituteData.contact_details.headOffice.pinCode ||
                        "N/A"
                      }`
                    : "N/A"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Facilities */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="bg-white bg-opacity-95 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-[#2D7A66]/10"
          >
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#144E53]">
                Facilities
              </h2>
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/institute/edit-facilities")}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-[#2D7A66] to-[#144E53] text-white rounded-lg shadow-md hover:from-[#144E53] hover:to-[#2D7A66] transition-all duration-300 flex items-center gap-2 text-xs sm:text-sm"
                aria-label="Edit Facilities"
              >
                <svg
                  className="w-4 sm:w-5 h-4 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                <span className="hidden sm:inline">Edit Facilities</span>
              </motion.button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[
                {
                  label: "Library",
                  value: instituteData.facilities.library || "No",
                  icon: (
                    <FaBook className="text-[#2D7A66] w-5 sm:w-6 h-5 sm:h-6" />
                  ),
                },
                {
                  label: "Mentorship Program",
                  value: instituteData.facilities.mentorship || "No",
                  icon: (
                    <FaChalkboardTeacher className="text-[#2D7A66] w-5 sm:w-6 h-5 sm:h-6" />
                  ),
                },
                {
                  label: "Tutorial & Remedial Classes",
                  value: instituteData.facilities.tutorial || "No",
                  icon: (
                    <FaChalkboard className="text-[#2D7A66] w-5 sm:w-6 h-5 sm:h-6" />
                  ),
                },
                {
                  label: "Hostel Accommodation",
                  value: instituteData.facilities.hostel || "No",
                  icon: (
                    <FaBuilding className="text-[#2D7A66] w-5 sm:w-6 h-5 sm:h-6" />
                  ),
                },
                {
                  label: "Test Series",
                  value: instituteData.facilities.testSeries || "No",
                  icon: (
                    <FaClipboardCheck className="text-[#2D7A66] w-5 sm:w-6 h-5 sm:h-6" />
                  ),
                },
                {
                  label: "Online Learning Portal",
                  value: instituteData.facilities.onlinePortal || "No",
                  icon: (
                    <FaLaptop className="text-[#2D7A66] w-5 sm:w-6 h-5 sm:h-6" />
                  ),
                },
                {
                  label: "Study Material",
                  value: instituteData.facilities.studyMaterials || "No",
                  icon: (
                    <FaBook className="text-[#2D7A66] w-5 sm:w-6 h-5 sm:h-6" />
                  ),
                },
                {
                  label: "Attendance Tracking",
                  value: instituteData.facilities.attendance || "No",
                  icon: (
                    <FaClipboardCheck className="text-[#2D7A66] w-5 sm:w-6 h-5 sm:h-6" />
                  ),
                },
                {
                  label: "Well-Equipped Classes",
                  value: instituteData.facilities.classes || "No",
                  icon: (
                    <FaSchool className="text-[#2D7A66] w-5 sm:w-6 h-5 sm:h-6" />
                  ),
                },
                {
                  label: "CCTV Surveillance",
                  value: instituteData.facilities.cctv || "No",
                  icon: (
                    <FaVideo className="text-[#2D7A66] w-5 sm:w-6 h-5 sm:h-6" />
                  ),
                },
                {
                  label: "Medical Facilities",
                  value: instituteData.facilities.medical || "No",
                  icon: (
                    <FaHospital className="text-[#2D7A66] w-5 sm:w-6 h-5 sm:h-6" />
                  ),
                },
                {
                  label: "Other Facilities",
                  value: instituteData.facilities.other || "None",
                  icon: (
                    <FaLink className="text-[#2D7A66] w-5 sm:w-6 h-5 sm:h-6" />
                  ),
                },
              ].map((facility, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border shadow-sm transition-all duration-300 ${
                    facility.value === "Yes" ||
                    (facility.label === "Other Facilities" &&
                      facility.value !== "None")
                      ? "bg-[#E6EDE2] border-[#2D7A66]"
                      : "bg-gray-50 border-gray-200"
                  } hover:shadow-lg hover:scale-[1.02]`}
                >
                  {facility.icon}
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-[#144E53]">
                      {facility.label}
                    </h3>
                    <p
                      className={`text-xs sm:text-sm font-medium ${
                        facility.value === "Yes"
                          ? "text-green-600"
                          : facility.value === "No" || facility.value === "None"
                          ? "text-red-600"
                          : "text-gray-950"
                      }`}
                    >
                      {facility.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8"
          >
            <div className="bg-white bg-opacity-95 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 border border-[#2D7A66]/10">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#144E53]">
                  Institute Achievements
                </h2>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    navigate("/institute/edit-achievements/institute")
                  }
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-[#2D7A66] to-[#144E53] text-white rounded-lg shadow-md hover:from-[#144E53] hover:to-[#2D7A66] transition-all duration-300 flex items-center gap-2 text-xs sm:text-sm"
                  aria-label="Edit Institute Achievements"
                >
                  <svg
                    className="w-4 sm:w-5 h-4 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Edit</span>
                </motion.button>
              </div>
              <div className="max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#2D7A66] scrollbar-track-gray-100">
                {instituteData.institute_achievements.achievements?.length >
                0 ? (
                  instituteData.institute_achievements.achievements.map(
                    (achievement, index) => (
                      <AchievementCard
                        key={achievement.id || index}
                        achievement={achievement}
                      />
                    )
                  )
                ) : (
                  <p className="text-gray-700 text-sm sm:text-base">
                    No institute achievements available.
                  </p>
                )}
              </div>
            </div>
            <div className="bg-white bg-opacity-95 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 border border-[#2D7A66]/10">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#144E53]">
                  Student Achievements
                </h2>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    navigate("/institute/edit-achievements/student")
                  }
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-[#2D7A66] to-[#144E53] text-white rounded-lg shadow-md hover:from-[#144E53] hover:to-[#2D7A66] transition-all duration-300 flex items-center gap-2 text-xs sm:text-sm"
                  aria-label="Edit Student Achievements"
                >
                  <svg
                    className="w-4 sm:w-5 h-4 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Edit</span>
                </motion.button>
              </div>
              <div className="max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#2D7A66] scrollbar-track-gray-100">
                {instituteData.student_achievements.achievements?.length > 0 ? (
                  instituteData.student_achievements.achievements.map(
                    (achievement) => (
                      <AchievementCard
                        key={achievement.id}
                        achievement={achievement}
                      />
                    )
                  )
                ) : (
                  <p className="text-gray-700 text-sm sm:text-base">
                    No student achievements available.
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Social Media Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            className="bg-white bg-opacity-95 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 border border-[#2D7A66]/10"
          >
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#144E53]">
                Follow Us
              </h2>
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/institute/edit-social-media")}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-[#2D7A66] to-[#144E53] text-white rounded-lg shadow-md hover:from-[#144E53] hover:to-[#2D7A66] transition-all duration-300 flex items-center gap-2 text-xs sm:text-sm"
                aria-label="Edit Social Media Links"
              >
                <svg
                  className="w-4 sm:w-5 h-4 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                <span className="hidden sm:inline">Edit</span>
              </motion.button>
            </div>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {[
                {
                  platform: "facebook",
                  url: instituteData.social_media.socialMedia?.facebook || "",
                },
                {
                  platform: "twitter",
                  url: instituteData.social_media.socialMedia?.twitter || "",
                },
                {
                  platform: "instagram",
                  url: instituteData.social_media.socialMedia?.instagram || "",
                },
                {
                  platform: "linkedin",
                  url: instituteData.social_media.socialMedia?.linkedin || "",
                },
                {
                  platform: "youtube",
                  url: instituteData.social_media.socialMedia?.youtube || "",
                },
                ...(instituteData.social_media.socialMedia?.other || []).map(
                  (other, index) => ({
                    platform: other.label?.toLowerCase() || `other-${index}`,
                    url: other.link || "",
                    key: `other-${index}`,
                  })
                ),
              ].map(
                (social, index) =>
                  social.url && (
                    <SocialMediaLink
                      key={social.key || index}
                      platform={social.platform}
                      url={social.url}
                    />
                  )
              )}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default InstituteDashboard;
