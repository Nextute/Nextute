import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Book,
  Briefcase,
  Phone,
  Mail,
  Edit,
  
} from "lucide-react";
import SidePanel from "./SidePanel.jsx";
import { useInstituteData } from "../../../hooks/useInstituteData.js";
import { assets } from "../../../assets/assets.js";
import Button from "../../ui/Button";
import Navbar from "../../Navbar.jsx";
import Footer from "../../Footer.jsx";
import LoadingSpinner from "../../LoadingSpinner.jsx";
import { FaMale } from "react-icons/fa";

const ViewTeacher = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { instituteDashboardData, dataLoading, error, hasRenderedOnce } =
    useInstituteData();

  // Load teacher data
  const teacher = (() => {
    if (!instituteDashboardData || !hasRenderedOnce) return null;
    try {
      const facultyData = JSON.parse(
        JSON.parse(instituteDashboardData.faculty_details).faculties
      );
      return facultyData.find((t) => (t.id || t.contact) === id);
    } catch (err) {
      toast.error("Error loading teacher data", {
        position: "top-right",
        duration: 3000,
        style: { background: "#E6EDE2", color: "#144E53", borderRadius: "8px" },
      });
      navigate("/institute/teachers");
      return null;
    }
  })();

  // Loading and error states
  if (dataLoading || !hasRenderedOnce) return <LoadingSpinner />;
  if (error || !teacher) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#E6EDE2] text-red-600 text-lg sm:text-xl font-semibold">
        Error loading teacher data. Please try again.
      </div>
    );
  }

  const fullName = `${teacher.firstName} ${teacher.middleName || ""} ${
    teacher.lastName
  }`.trim();

  const fields = [
    {
      label: "Full Name",
      value: fullName,
      icon: <User className="w-5 h-5 text-[#2D7A66]" />,
    },
    {
      label: "Subject",
      value: teacher.subject || "N/A",
      icon: <Book className="w-5 h-5 text-[#2D7A66]" />,
    },
    {
      label: "Experience",
      value: teacher.experience ? `${teacher.experience} years` : "N/A",
      icon: <Briefcase className="w-5 h-5 text-[#2D7A66]" />,
    },
    {
      label: "Qualification",
      value: teacher.qualification || "N/A",
      icon: <Book className="w-5 h-5 text-[#2D7A66]" />,
    },
    {
      label: "Contact",
      value: teacher.contact || "N/A",
      icon: <Phone className="w-5 h-5 text-[#2D7A66]" />,
    },
    {
      label: "Email",
      value: teacher.email || "N/A",
      icon: <Mail className="w-5 h-5 text-[#2D7A66]" />,
    },
    {
      label: "Gender",
      value: teacher.gender || "N/A",
      icon: <FaMale className="w-5 h-5 text-[#2D7A66]" />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#E6EDE2]">
      <Navbar />
      <div className="flex flex-1">
        <SidePanel />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/institute/teachers")}
              className="p-2 bg-[#2D7A66] text-white rounded-full hover:bg-[#144E53] transition-all duration-300"
              aria-label="Back to Teachers"
            >
              <ArrowLeft className="w-5 sm:w-6 h-5 sm:h-6" />
            </motion.div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#144E53] tracking-tight">
              Teacher Details
            </h1>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-[#2D7A66]/10"
          >
            <div className="flex flex-col sm:flex-row gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl border-2 border-[#2D7A66]/20 overflow-hidden">
                  <img
                    src={teacher.photo || assets.Not_found}
                    alt={`${fullName} Photo`}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.src = assets.Not_found)}
                  />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-[#144E53] mt-4 text-center">
                  {fullName}
                </h2>
              </motion.div>
              <div className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {fields.map(({ label, value, icon }, index) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: (index + 1) * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="p-2 bg-[#E6EDE2] rounded-full">
                        {icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#2D7A66]">
                          {label}
                        </p>
                        <p className="text-base text-gray-700 truncate">
                          {value}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: fields.length * 0.1 + 0.1,
                  }}
                  className="flex justify-end gap-3 mt-6"
                >
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/institute/edit-teacher/${id}`)}
                    className="text-sm"
                    aria-label={`Edit ${fullName}`}
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/institute/teachers")}
                    className="text-sm"
                    aria-label="Back to Teachers"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default ViewTeacher;
