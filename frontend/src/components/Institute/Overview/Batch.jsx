import React from "react";
import { motion } from "framer-motion";

const Batch = ({ data }) => {
  console.log("batch details", data);
  console.log("course", data?.courses);

  return (
    <div className="space-y-6">
      {data?.courses?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {data?.courses.map((batch, index) => (
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
              className="w-full bg-gradient-to-br from-teal-50 to-white rounded-xl p-6  mx-auto h-64 shadow-lg border border-teal-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-teal-800 line-clamp-1">
                  {batch.name || `Batch ${index + 1}`}
                </h3>
                <span className="inline-block bg-teal-100 text-teal-700 text-sm font-medium px-3 py-1 rounded-full">
                  {batch.category || "N/A"}
                </span>
              </div>
              <div className="space-y-3 text-base">
                <p className="text-gray-600 line-clamp-1">
                  Course: {batch.details || "Not Available"}
                </p>
                <p className="text-gray-600 line-clamp-1">
                  Medium: {batch.medium || "Not Available"}
                </p>
                <p className="text-gray-600">
                  Fee:{" "}
                  <span className="text-teal-700 font-semibold">
                    {batch.feeRange || "Not Available"}
                  </span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center text-lg py-4">
          No batch information available.
        </p>
      )}
    </div>
  );
};

export default Batch;
