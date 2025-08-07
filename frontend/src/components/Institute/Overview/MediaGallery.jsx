import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaExpand, FaTimes } from "react-icons/fa";

const MediaGallery = ({ data }) => {
  let parsedData = {};

  try {
    parsedData = typeof data === "string" ? JSON.parse(data) : data;
  } catch (e) {
    console.error("Invalid JSON:", e);
  }

  const mediaItems = [
    ...(parsedData?.classroomImages || []).map((url, index) => ({
      id: `classroom-${index}`,
      type: "image",
      url,
      title: `Classroom Image ${index + 1}`,
    })),
    ...(parsedData?.demoVideos || []).map((url, index) => ({
      id: `demo-${index}`,
      type: "video",
      url,
      title: `Demo Video ${index + 1}`,
    })),
    ...(parsedData?.tourVideos || []).map((url, index) => ({
      id: `tour-${index}`,
      type: "video",
      url,
      title: `Tour Video ${index + 1}`,
    })),
  ];

  // State for image preview
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {mediaItems.length > 0 ? (
          mediaItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
              }}
              transition={{
                duration: 0.6,
                delay: mediaItems.indexOf(item) * 0.1,
                type: "spring",
                stiffness: 100,
              }}
              className="bg-white rounded-xl p-4 shadow-md border border-teal-200 overflow-hidden group"
            >
              <div className="relative">
                {item.type === "image" ? (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-lg cursor-pointer"
                    onClick={() => setSelectedImage(item.url)}
                  />
                ) : (
                  <video
                    src={item.url}
                    controls
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
                {item.type === "image" && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute top-2 right-2 bg-white/80 rounded-full p-2 text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={() => setSelectedImage(item.url)}
                  >
                    <FaExpand />
                  </motion.button>
                )}
              </div>
              <p className="text-teal-800 font-semibold mt-2 text-center line-clamp-1">
                {item.title}
              </p>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-600 col-span-full text-center text-lg py-4">
            No media available.
          </p>
        )}
      </motion.div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
              className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                aria-label="Close preview"
              >
                <FaTimes size={24} />
              </button>
              <img
                src={selectedImage}
                alt="Full-size preview"
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediaGallery;
