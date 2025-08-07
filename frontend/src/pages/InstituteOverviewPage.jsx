import React, { useState, useEffect, Suspense, lazy } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import OverviewHeader from "../components/Institute/Overview/OverviewHeader";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

// Lazy load components
const Overview = lazy(() =>
  import("../components/Institute/Overview/Overview")
);
const Faculty = lazy(() => import("../components/Institute/Overview/Faculty"));
const Facilities = lazy(() =>
  import("../components/Institute/Overview/Facilities")
);
const MediaGallery = lazy(() =>
  import("../components/Institute/Overview/MediaGallery")
);
const Batch = lazy(() => import("../components/Institute/Overview/Batch"));
const Reviews = lazy(() => import("../components/Institute/Overview/Reviews"));
const Achievements = lazy(() =>
  import("../components/Institute/Overview/Achievements")
);

// Utility function for safe JSON parsing
const safeParseJSON = (data, defaultValue = {}) => {
  if (!data) return defaultValue;
  try {
    return typeof data === "string" ? JSON.parse(data) : data;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return defaultValue;
  }
};

const InstituteOverview = () => {
  const { id } = useParams();
  const [instituteData, setInstituteData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Overview");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Institute ID is missing.");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const instituteRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/api/institutes/${id}`,
          { withCredentials: true }
        );

        const institute = instituteRes?.data?.data;
        if (institute) {
          setInstituteData(institute);
        } else {
          setError("Invalid institute data.");
        }
      } catch (err) {
        console.error("Error fetching institute:", err);
        toast.error("Failed to fetch institute data.", {
          position: "top-center",
          duration: 3000,
        });
        setError("Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const tabs = [
    {
      name: "Overview",
      label: "Overview",
      component: (
        <Overview
          data={instituteData}
          socialMediaData={safeParseJSON(instituteData?.social_media, {})}
        />
      ),
    },
    {
      name: "Faculty",
      label: "Faculty",
      component: (
        <Faculty
          data={safeParseJSON(
            instituteData?.faculty_details
              ? JSON.parse(instituteData.faculty_details).faculties
              : null,
            []
          )}
        />
      ),
    },
    {
      name: "Facilities",
      label: "Facilities",
      component: (
        <Facilities data={safeParseJSON(instituteData?.facilities, [])} />
      ),
    },
    {
      name: "Media Gallery",
      label: "Media Gallery",
      component: (
        <MediaGallery data={safeParseJSON(instituteData?.media_gallery, {})} />
      ),
    },
    {
      name: "Batches",
      label: "Batches",
      component: <Batch data={safeParseJSON(instituteData?.courses, [])} />,
    },
    {
      name: "Reviews",
      label: "Reviews",
      component: (
        <Reviews instituteId={id} reviews={reviews} setReviews={setReviews} />
      ),
    },
    {
      name: "Achievements",
      label: "Achievements",
      component: (
        <Achievements
          data={{
            institute_achievements: safeParseJSON(
              instituteData?.institute_achievements,
              []
            ),
            student_achievements: safeParseJSON(
              instituteData?.student_achievements,
              []
            ),
          }}
        />
      ),
    },
  ];

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200"
      >
        <LoadingSpinner />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200"
      >
        <div className="text-red-600 text-center p-4 sm:p-6 text-base sm:text-lg font-semibold bg-white/80 backdrop-blur-md rounded-lg shadow-md border border-red-200">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-sm text-[#2D7A67] hover:text-[#1A433A] underline font-medium"
            aria-label="Retry loading data"
          >
            Retry
          </button>
        </div>
      </motion.div>
    );
  }

  if (!instituteData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200"
      >
        <div className="text-gray-700 text-center p-4 sm:p-6 text-base sm:text-lg font-semibold bg-white/80 backdrop-blur-md rounded-lg shadow-md border border-gray-200">
          No institute data available.
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 text-gray-800 font-sans">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <OverviewHeader data={safeParseJSON(instituteData.basic_info, {})} />

        {/* Sticky Tab Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className=" bg-white/90 backdrop-blur-md shadow-md rounded-b-lg py-3 sm:py-4 mb-4 sm:mb-6"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto flex space-x-2 sm:space-x-3 no-scrollbar">
            {tabs.map((tab, index) => (
              <motion.button
                key={tab.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedTab(tab.name)}
                className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                  selectedTab === tab.name
                    ? "bg-[#2D7A67] text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-[#AAD294]/30"
                } focus:outline-none focus:ring-2 focus:ring-[#2D7A67] focus:ring-opacity-50`}
                aria-selected={selectedTab === tab.name}
                role="tab"
              >
                {tab.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-4 sm:p-6 lg:p-8"
        >
          <Suspense fallback={<LoadingSpinner />}>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {tabs.find((tab) => tab.name === selectedTab)?.component || (
                  <div className="text-gray-600 text-center p-4 sm:p-6 text-sm sm:text-base font-medium">
                    No content available for this tab.
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </Suspense>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default InstituteOverview;
