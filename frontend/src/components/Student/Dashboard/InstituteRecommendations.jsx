import { motion } from "framer-motion";
import { assets } from "../../../assets/assets.js";

const InstituteRecommendations = ({ studentData }) => {
  const institutes = studentData?.recommendedInstitutes || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg p-8 bg-opacity-80 backdrop-blur-lg"
    >
      <div className="flex items-center gap-3 mb-6">
        <img src={assets.course} alt="Course Icon" className="w-6 h-6" />
        <h2 className="text-2xl font-bold text-gray-800">
          Institute Recommendations
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {institutes.map((institute, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
            }}
            className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-6 border border-teal-200 overflow-hidden"
          >
            <img
              src={institute.image || assets.coaching}
              alt={institute.name}
              className="w-full h-32 object-cover rounded-lg mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-800">
              {institute.name}
            </h3>
            <p className="text-sm text-gray-600">
              Location: {institute.location}
            </p>
            <p className="text-sm text-gray-600">
              Rating: {institute.rating}/5
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
            >
              Explore More
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default InstituteRecommendations;
