// ...same imports
import React, { useState } from "react";
import { FaTrophy, FaMedal, FaFileAlt, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Achievements = ({ data }) => {
  const [previewDoc, setPreviewDoc] = useState(null);

  let instituteAchievements = [];
let studentAchievements = [];

try {
  const parsed =
    typeof data?.institute_achievements === "string"
      ? JSON.parse(data.institute_achievements)
      : data?.institute_achievements || {};
  instituteAchievements = Array.isArray(parsed.achievements)
    ? parsed.achievements
    : [];
} catch (err) {
  console.error("Error parsing institute achievements", err);
}

try {
  const parsed =
    typeof data?.student_achievements === "string"
      ? JSON.parse(data.student_achievements)
      : data?.student_achievements || {};
  studentAchievements = Array.isArray(parsed.achievements)
    ? parsed.achievements
    : [];
} catch (err) {
  console.error("Error parsing student achievements", err);
}


  const renderAchievements = (achievements, title, icon) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-6"
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="text-3xl font-bold text-gray-800 flex items-center gap-3"
      >
        {icon}
        {title}
      </motion.h2>

      {achievements.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
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
              className="relative bg-white rounded-2xl p-6 shadow-md border border-gray-100 group"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-teal-500/20 rounded-bl-full"></div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 pr-12 line-clamp-1">
                {achievement.title || "Untitled Achievement"}
              </h3>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                {achievement.description || "No description available."}
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                {achievement.instituteName && (
                  <p>
                    <span className="font-medium text-gray-700">
                      Institute:
                    </span>{" "}
                    {achievement.instituteName}
                  </p>
                )}
                {achievement.department && (
                  <p>
                    <span className="font-medium text-gray-700">
                      Department:
                    </span>{" "}
                    {achievement.department}
                  </p>
                )}
                {achievement.studentId && (
                  <p>
                    <span className="font-medium text-gray-700">
                      Student ID:
                    </span>{" "}
                    {achievement.studentId}
                  </p>
                )}
                {achievement.grade && (
                  <p>
                    <span className="font-medium text-gray-700">Grade:</span>{" "}
                    {achievement.grade}
                  </p>
                )}
                {achievement.course && (
                  <p>
                    <span className="font-medium text-gray-700">Course:</span>{" "}
                    {achievement.course}
                  </p>
                )}
                {achievement.type && (
                  <p>
                    <span className="font-medium text-gray-700">Type:</span>{" "}
                    {achievement.type}
                  </p>
                )}
                {achievement.level && (
                  <p>
                    <span className="font-medium text-gray-700">Level:</span>{" "}
                    {achievement.level}
                  </p>
                )}
                {achievement.award && (
                  <p>
                    <span className="font-medium text-gray-700">Award:</span>{" "}
                    {achievement.award}
                  </p>
                )}
                <p>
                  <span className="font-medium text-gray-700">Year:</span>{" "}
                  {achievement.date
                    ? new Date(achievement.date).getFullYear()
                    : "N/A"}
                </p>
              </div>

              {achievement.documents?.length > 0 && (
                <div className="mt-5">
                  <p className="text-sm font-medium text-teal-600 flex items-center gap-2 mb-2">
                    <FaFileAlt /> Documents:
                  </p>
                  <ul className="space-y-2">
                    {achievement.documents.map((doc, idx) => (
                      <li key={idx}>
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="text-teal-600 hover:text-teal-800 text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                          aria-label={`Preview document ${idx + 1}`}
                        >
                          <FaFileAlt className="text-teal-500" />
                          Document {idx + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          className="text-gray-600 text-center text-lg"
        >
          No {title.toLowerCase()} available.
        </motion.p>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {renderAchievements(
          instituteAchievements,
          "Institute Achievements",
          <FaTrophy className="text-teal-600 text-3xl" />
        )}

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          className="border-t border-gray-200 my-10"
        ></motion.div>

        {renderAchievements(
          studentAchievements,
          "Student Achievements",
          <FaMedal className="text-teal-600 text-3xl" />
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {previewDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setPreviewDoc(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
              className="bg-white rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPreviewDoc(null)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
              >
                <FaTimes size={24} />
              </button>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Document Preview
              </h3>
              <div className="bg-gray-100 rounded-lg p-4">
                {previewDoc.endsWith(".pdf") ? (
                  <iframe
                    src={previewDoc}
                    className="w-full h-[60vh] rounded-lg"
                    title="Document Preview"
                  />
                ) : (
                  <img
                    src={previewDoc}
                    alt="Document Preview"
                    className="w-full max-h-[60vh] object-contain rounded-lg"
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Achievements;
