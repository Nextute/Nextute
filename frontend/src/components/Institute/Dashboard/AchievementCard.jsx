import React from "react";
import { motion } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";

const AchievementCard = ({ achievement, onEdit, onDelete }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{
      translateY: -5,
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
    }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="mb-3 sm:mb-4 p-3 sm:p-4 rounded-lg bg-gradient-to-br from-white to-[#E6EDE2] bg-opacity-95 backdrop-blur-xl border border-[#2D7A66]/10 hover:shadow-lg transition-all duration-300"
  >
    <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
      <div className="w-full">
        <h3 className="text-base sm:text-lg font-semibold text-[#2D7A66] truncate">
          {achievement.title}
        </h3>
        <p className="text-gray-700 text-xs sm:text-sm line-clamp-2">
          {achievement.description}
        </p>
        <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
          {achievement.date} | {achievement.level} | Award: {achievement.award}
        </p>
      </div>
      <div className="flex gap-2 sm:gap-3 shrink-0">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onEdit}
          className="p-2 bg-white rounded-full text-[#2D7A66] hover:bg-[#93E9A2] transition-all duration-200 shadow-sm"
          aria-label={`Edit ${achievement.title}`}
        >
          <Edit className="w-4 sm:w-5 h-4 sm:h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onDelete}
          className="p-2 bg-white rounded-full text-red-600 hover:bg-red-100 transition-all duration-200 shadow-sm"
          aria-label={`Delete ${achievement.title}`}
        >
          <Trash2 className="w-4 sm:w-5 h-4 sm:h-5" />
        </motion.button>
      </div>
    </div>
  </motion.div>
);

export default React.memo(AchievementCard);
