import React from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Facilities = ({ data }) => {
  console.log("facilities data", data);

  if (!data || Object.keys(data).length === 0) {
    return (
      <p className="text-gray-600 text-center text-lg py-4">
        No facilities information available.
      </p>
    );
  }

  // Convert object entries into an array of [key, value]
  const facilitiesArray = Object.entries(data);

  // Facility descriptions based on keys
  const facilityDescriptions = {
    onlinePortal:
      "A digital platform providing access to course materials, assignments, and announcements 24/7.",
    library:
      "A well-stocked library with books, journals, and e-resources to support academic research.",
    laboratory:
      "State-of-the-art labs equipped for hands-on learning and experimentation.",
    hostel:
      "Comfortable on-campus accommodation with modern amenities for students.",
    cafeteria:
      "A hygienic and diverse food court offering meals tailored to student needs.",
    sportsComplex:
      "Facilities for various sports including a gym, courts, and fields for physical development.",
    transportation:
      "Reliable shuttle services connecting the campus to key locations.",
    wifi: "High-speed internet access available across the campus for seamless connectivity.",
    default:
      "Additional facility providing enhanced learning and living experiences.",
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilitiesArray.map(([key, value], index) => {
          // Format the key to be readable, e.g. 'onlinePortal' => 'Online Portal'
          const facilityName = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase());

          // Check if available or not
          const isAvailable =
            typeof value === "string"
              ? value.toLowerCase() === "yes"
              : Boolean(value);

          const description =
            facilityDescriptions[key] || facilityDescriptions.default;

          return (
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
              className="w-full bg-gradient-to-br from-teal-50 to-white rounded-xl p-6 max-w-md mx-auto h-48 shadow-lg border border-teal-200"
            >
              <div className="flex items-start gap-4 mb-4">
                {isAvailable ? (
                  <FaCheckCircle className="text-teal-600 text-2xl mt-1" />
                ) : (
                  <FaTimesCircle className="text-red-500 text-2xl mt-1" />
                )}
                <div>
                  <h3 className="text-2xl font-bold text-teal-800 line-clamp-1 mb-2">
                    {facilityName}
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed line-clamp-2">
                    {description}
                  </p>
                  <p className="text-gray-700 mt-2 text-sm">
                    Status:{" "}
                    <span
                      className={`${
                        isAvailable ? "text-teal-600" : "text-red-500"
                      } text-lg font-medium`}
                    >
                      {isAvailable ? "Available" : "Not Available"}
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Facilities;
