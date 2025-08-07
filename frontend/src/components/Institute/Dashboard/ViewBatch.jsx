import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  Book,
  DollarSign,
  Languages,
  Edit,
} from "lucide-react";
import SidePanel from "./SidePanel";
import { useInstituteData } from "../../../hooks/useInstituteData.js";
import { assets } from "../../../assets/assets.js";
import Button from "../../ui/Button";
import Navbar from "../../Navbar.jsx";
import Footer from "../../Footer.jsx";
import LoadingSpinner from "../../LoadingSpinner.jsx";

const ViewBatch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { instituteDashboardData, dataLoading, error, hasRenderedOnce } =
    useInstituteData();
  const [showFullDetails, setShowFullDetails] = useState(false);

  // Load batch data
  const batch = (() => {
    if (!instituteDashboardData || !hasRenderedOnce) return null;
    try {
      const batchData =
        JSON.parse(instituteDashboardData.courses).courses || [];
      return (
        batchData.find((b, index) => (b.id || `batch-${index}`) === id) || null
      );
    } catch (err) {
      toast.error("Error parsing batch data", {
        position: "top-right",
        duration: 3000,
        style: { background: "#E6EDE2", color: "#144E53", borderRadius: "8px" },
      });
      navigate("/institute/batches");
      return null;
    }
  })();

  // Loading and error states
  if (dataLoading || !hasRenderedOnce) return <LoadingSpinner />;
  if (error || !batch) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#E6EDE2] text-red-600 text-base sm:text-lg font-semibold">
        Error loading batch data. Please try again.
      </div>
    );
  }

  const fields = [
    {
      label: "Batch Name",
      value: batch.name || "N/A",
      icon: <Users className="w-5 h-5 text-[#2D7A66]" />,
      id: "batch-name",
    },
    {
      label: "Category",
      value: batch.category || "N/A",
      icon: <Book className="w-5 h-5 text-[#2D7A66]" />,
      id: "batch-category",
    },
    {
      label: "Details",
      value: batch.details || "N/A",
      icon: <Book className="w-5 h-5 text-[#2D7A66]" />,
      id: "batch-details",
      isLongText: true,
    },
    {
      label: "Fee Range",
      value: batch.feeRange || "N/A",
      icon: <DollarSign className="w-5 h-5 text-[#2D7A66]" />,
      id: "batch-feeRange",
    },
    {
      label: "Medium",
      value: batch.medium || "N/A",
      icon: <Languages className="w-5 h-5 text-[#2D7A66]" />,
      id: "batch-medium",
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
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 3 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/institute/batches")}
              className="p-2 bg-[#2D7A66] text-white rounded-full hover:bg-[#144E53] transition-all duration-300"
              aria-label="Back to Batches"
            >
              <ArrowLeft className="w-5 sm:w-6 h-5 sm:h-6" />
            </motion.div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#144E53] tracking-tight">
              Batch Details
            </h1>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-[#2D7A66]/10"
          >
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex flex-col items-center w-full lg:w-1/3"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="w-24 sm:w-32 lg:w-40 h-24 sm:h-32 lg:h-40 rounded-xl border-2 border-[#2D7A66]/20 overflow-hidden"
                >
                  <img
                    src={batch.image || assets.Not_found}
                    alt={`${batch.name} Image`}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.src = assets.Not_found)}
                  />
                </motion.div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#144E53] mt-4 text-center">
                  {batch.name || "Unnamed Batch"}
                </h2>
              </motion.div>
              <div className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {fields.map(
                    ({ label, value, icon, id, isLongText }, index) => (
                      <motion.div
                        key={id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: (index + 1) * 0.1 }}
                        className="flex flex-col gap-2"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#E6EDE2] rounded-full">
                            {icon}
                          </div>
                          <p className="text-sm sm:text-base font-medium text-[#2D7A66]">
                            {label}
                          </p>
                        </div>
                        <div
                          id={id}
                          className={`text-sm sm:text-base text-gray-700 ${
                            isLongText && !showFullDetails ? "line-clamp-3" : ""
                          } bg-[#E6EDE2]/50 p-2 rounded-lg max-h-32 sm:max-h-40 overflow-auto scrollbar-thin scrollbar-thumb-[#2D7A66]/50 scrollbar-track-[#E6EDE2]`}
                          title={isLongText ? value : undefined}
                          aria-describedby={
                            isLongText ? `${id}-description` : undefined
                          }
                        >
                          {value}
                          {isLongText && (
                            <div id={`${id}-description`} className="sr-only">
                              {value}
                            </div>
                          )}
                        </div>
                        {isLongText && value.length > 100 && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowFullDetails(!showFullDetails)}
                            className="text-sm text-[#2D7A66] hover:text-[#144E53] underline mt-1"
                            aria-label={
                              showFullDetails
                                ? "Show less details"
                                : "Show more details"
                            }
                          >
                            {showFullDetails ? "Show Less" : "Show More"}
                          </motion.button>
                        )}
                      </motion.div>
                    )
                  )}
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: fields.length * 0.1 + 0.2,
                  }}
                  className="flex justify-end gap-3 mt-6 sm:mt-8"
                >
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => navigate(`/institute/edit-batch/${id}`)}
                    aria-label={`Edit ${batch.name || "batch"}`}
                  >
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => navigate("/institute/batches")}
                    aria-label="Back to Batches"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
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

export default ViewBatch;
