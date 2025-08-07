import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import SidePanel from "./SidePanel";
import { useInstituteData } from "../../../hooks/useInstituteData.js";
import LoadingSpinner from "../../LoadingSpinner.jsx";
import { assets } from "../../../assets/assets.js";
import Navbar from "../../Navbar.jsx";
import Footer from "../../Footer.jsx";

const InstituteMedia = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { instituteDashboardData, dataLoading, error, hasRenderedOnce } = useInstituteData();
  const [media, setMedia] = useState({
    classroomImages: [],
    demoVideos: [],
    tourVideos: [],
  });

  // Welcome back popup for returning users
  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedMedia");
    if (hasVisited) {
      toast(
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <h3 className="text-lg font-semibold text-[#144E53]">
              Welcome Back!
            </h3>
            <p className="text-sm text-gray-600">
              Explore and manage your institute's media gallery.
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
    localStorage.setItem("hasVisitedMedia", "true");
  }, []);

  // Handle updates from EditMedia
  useEffect(() => {
    if (location.state?.updatedMedia) {
      const { type, updatedItem } = location.state.updatedMedia;
      setMedia((prev) => ({
        ...prev,
        [type]: prev[type].map((item) => (item.id === updatedItem.id ? updatedItem : item)),
      }));
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  // Load initial media data
  useEffect(() => {
    if (instituteDashboardData && hasRenderedOnce) {
      try {
        const rawMediaGallery = instituteDashboardData?.media_gallery;
        const mediaGallery = typeof rawMediaGallery === "string" ? JSON.parse(rawMediaGallery) : rawMediaGallery || {};
        const classroomImages = Array.isArray(mediaGallery.classroomImages) ? mediaGallery.classroomImages : [];
        const demoVideos = Array.isArray(mediaGallery.demoVideos) ? mediaGallery.demoVideos : [];
        const tourVideos = Array.isArray(mediaGallery.tourVideos) ? mediaGallery.tourVideos : [];

        setMedia({
          classroomImages: classroomImages.map((url, index) => ({
            id: `image-${index}`,
            title: `Classroom Image ${index + 1}`,
            url,
            description: `Classroom image ${index + 1}`,
          })),
          demoVideos: demoVideos.map((url, index) => ({
            id: `demo-${index}`,
            title: `Demo Video ${index + 1}`,
            url,
            description: `Demo video ${index + 1}`,
          })),
          tourVideos: tourVideos.map((url, index) => ({
            id: `tour-${index}`,
            title: `Tour Video ${index + 1}`,
            url,
            description: `Tour video ${index + 1}`,
          })),
        });
      } catch (err) {
        console.error("Error parsing media data:", err);
        toast.error("Error loading media data. Please try again.", {
          position: "top-right",
          duration: 3000,
          style: { background: "#E6EDE2", color: "#144E53", borderRadius: "8px" },
        });
      }
    }
  }, [instituteDashboardData, hasRenderedOnce]);

  if (dataLoading || !hasRenderedOnce) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 text-red-600 text-lg sm:text-xl font-semibold">
        Error loading media data: {error.message || "Unknown error"}. Please try again.
      </div>
    );
  }

  const handleDelete = (type, id, title) => {
    toast(
      <div className="flex flex-col gap-3">
        <p className="text-sm sm:text-base">Are you sure you want to delete {title}?</p>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-sm"
            onClick={async () => {
              try {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setMedia((prev) => ({
                  ...prev,
                  [type]: prev[type].filter((item) => item.id !== id),
                }));
                toast.success(`${title} deleted successfully!`, {
                  position: "top-right",
                  duration: 3000,
                  style: { background: "#E6EDE2", color: "#144E53", borderRadius: "8px" },
                });
              } catch (err) {
                toast.error("Failed to delete media", {
                  position: "top-right",
                  duration: 3000,
                  style: { background: "#E6EDE2", color: "#144E53", borderRadius: "8px" },
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
        style: { background: "#fff", color: "#144E53", padding: "16px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)" },
      }
    );
  };

  const mediaTypes = [
    { key: "classroomImages", title: "Classroom Images", emptyMessage: "No classroom images available. Add some to showcase your institute!" },
    { key: "demoVideos", title: "Demo Videos", emptyMessage: "No demo videos available. Add some to highlight your teaching!" },
    { key: "tourVideos", title: "Tour Videos", emptyMessage: "No tour videos available. Add some to give a virtual tour!" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <Navbar />
      <div className="flex flex-1 flex-col md:flex-row">
        
          <SidePanel />
        
        
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-4"
          >
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#144E53] tracking-tight">Media & Photos</h1>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/institute/add-media")}
              className="px-4 sm:px-6 py-2 bg-gradient-to-r from-[#2D7A66] to-[#144E53] text-white rounded-lg shadow-md hover:from-[#144E53] hover:to-[#2D7A66] transition-all duration-300 flex items-center gap-2 text-sm sm:text-base"
            >
              <FaPlus className="w-4 sm:w-5 h-4 sm:h-5" /> Add Media
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="bg-white bg-opacity-95 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 border border-[#2D7A66]/10"
          >
            {mediaTypes.map(({ key, title, emptyMessage }, index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="mb-6 sm:mb-8"
              >
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#144E53] mb-4">{title}</h2>
                {media[key].length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {media[key].map((item) => (
                      <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.03, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)" }}
                        className="relative bg-[#E6EDE2] p-4 rounded-lg shadow-sm border border-[#2D7A66]/30 transition-all duration-300"
                      >
                        <div className="absolute top-2 right-2 flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-white rounded-full text-green-600 hover:bg-green-100 transition-all duration-200 shadow-sm"
                            onClick={() => navigate(`/institute/edit-media/${key}/${item.id}`, { state: { mediaItem: item, mediaType: key } })}
                            aria-label={`Edit ${item.title}`}
                          >
                            <FaEdit className="w-4 sm:w-5 h-4 sm:h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-white rounded-full text-red-600 hover:bg-red-100 transition-all duration-200 shadow-sm"
                            onClick={() => handleDelete(key, item.id, item.title)}
                            aria-label={`Delete ${item.title}`}
                          >
                            <FaTrash className="w-4 sm:w-5 h-4 sm:h-5" />
                          </motion.button>
                        </div>
                        {key === "classroomImages" ? (
                          <img
                            src={item.url}
                            alt={item.title}
                            className="w-full h-40 sm:h-48 object-cover rounded-md mb-3 aspect-video"
                            onError={(e) => (e.target.src = assets.Not_found)}
                          />
                        ) : (
                          <video
                            src={item.url}
                            controls
                            className="w-full h-40 sm:h-48 object-cover rounded-md mb-3 aspect-video"
                          />
                        )}
                        <h3 className="text-base sm:text-lg font-semibold text-[#144E53] truncate">{item.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-700 line-clamp-2">{item.description}</p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-10">
                    <img
                      src={assets.Not_found}
                      alt="No Media"
                      className="mx-auto mb-4 w-20 sm:w-24 h-20 sm:h-24 opacity-50"
                      onError={(e) => (e.target.src = assets.Not_found)}
                    />
                    <p className="text-gray-700 text-sm sm:text-base mb-4">{emptyMessage}</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/institute/add-media")}
                      className="px-4 sm:px-6 py-2 bg-gradient-to-r from-[#2D7A66] to-[#144E53] text-white rounded-lg shadow-md hover:from-[#144E53] hover:to-[#2D7A66] transition-all duration-300 text-sm sm:text-base"
                    >
                      Add {title}
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InstituteMedia;