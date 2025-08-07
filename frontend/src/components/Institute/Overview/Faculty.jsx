import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Faculty = ({ data }) => {
  console.log("✅ Faculty component received data:", data);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {data.length > 0 ? (
          data.map((faculty, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
              }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
              }}
              className="bg-white rounded-xl p-5 shadow-md border border-teal-200 group"
            >
              <div className="flex justify-center mb-4 relative">
                <img
                  src={faculty.photo || "https://via.placeholder.com/150"}
                  alt={`${faculty.firstName} ${faculty.lastName}`}
                  className="w-28 h-28 rounded-full object-cover border-2 border-teal-300"
                />
              </div>
              <h3 className="text-lg font-bold text-teal-800 text-center mb-2 line-clamp-1">
                {`${faculty.firstName || ""} ${faculty.middleName || ""} ${
                  faculty.lastName || ""
                }`.trim() || "Unnamed Faculty"}
              </h3>
              <p className="text-gray-600 text-center mb-1">
                Qualification: {faculty.qualification || "Not Available"}
              </p>
              <p className="text-gray-600 text-center">
                Subject: {faculty.subject || "Not Available"}
              </p>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-600 col-span-full text-center text-lg py-4">
            No faculty information available.
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Faculty;
