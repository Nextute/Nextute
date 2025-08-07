import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import { ChevronRight } from "lucide-react";
import useInstitutes from "../hooks/useInstitutes";
import CustomDropdown from "../components/CustomDropdown";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";

const InstituteComparePage = () => {
  const { loading, error } = useInstitutes();
  const { institutes } = useContext(AppContext);
  const [institute1, setInstitute1] = useState("");
  const [institute2, setInstitute2] = useState("");
  const navigate = useNavigate();

  const handleCompare = () => {
    if (institute1 && institute2 && institute1 !== institute2) {
      navigate(
        `/compare-result?institute1=${encodeURIComponent(
          institute1
        )}&institute2=${encodeURIComponent(institute2)}`
      );
    } else {
      toast.error("Please select two different institutes.", {
        position: "top-center",
        duration: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 font-sans">
      <Navbar />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[93rem] mx-auto py-12 sm:py-16 lg:py-20"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Empower Your Choice with{" "}
              <span className="text-[#2D7A67]">Institute Comparison</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              Compare top institutes based on courses, fees, facilities, and
              more to find the perfect fit for your academic journey.
            </p>
            <p className="text-sm sm:text-base text-gray-500">
              Make informed decisions with our side-by-side comparison tool.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 lg:p-8"
        >
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
            Select Institutes to Compare
          </h2>
          {loading && <LoadingSpinner />}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center py-8 bg-red-50 rounded-lg border border-red-200"
            >
              <span className="text-base sm:text-lg text-red-600 font-semibold mb-2">
                {error}
              </span>
              <button
                onClick={() => window.location.reload()}
                className="text-sm text-[#2D7A67] hover:text-[#1A433A] underline font-medium"
                aria-label="Retry loading institutes"
              >
                Retry
              </button>
            </motion.div>
          )}
          {!loading && !error && (
            <div className="space-y-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
                {/* Institute 1 Selection */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="w-full lg:w-[45%]"
                >
                  <CustomDropdown
                    label="First Institute"
                    value={institute1}
                    onChange={(val) => setInstitute1(val)}
                    options={institutes.map((ins) => ins.institute_name)}
                    placeholder="Select first institute"
                  />
                </motion.div>

                {/* VS Separator */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex items-center justify-center w-full lg:w-[10%] text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2D7A67]"
                >
                  VS
                </motion.div>

                {/* Institute 2 Selection */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="w-full lg:w-[45%]"
                >
                  <CustomDropdown
                    label="Second Institute"
                    value={institute2}
                    onChange={(val) => setInstitute2(val)}
                    options={institutes.map((ins) => ins.institute_name)}
                    placeholder="Select second institute"
                  />
                </motion.div>
              </div>

              {/* Compare Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex justify-center sm:justify-end"
              >
                <button
                  onClick={handleCompare}
                  className="group w-full sm:w-auto bg-[#2D7A67] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-[#1A433A] disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  disabled={loading || !institute1 || !institute2}
                  aria-label="Compare the selected institutes"
                >
                  <span className="text-sm sm:text-base">Compare Now</span>
                  <ChevronRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </motion.div>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default InstituteComparePage;
