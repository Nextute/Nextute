import React from "react";
import { motion } from "framer-motion";

const SummaryCard = ({
  title,
  value,
  icon,
  iconSize = "w-6 sm:w-8 h-6 sm:h-8",
  className = "",
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.05, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)" }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className={`bg-gradient-to-br from-white to-[#E6EDE2] bg-opacity-95 backdrop-blur-xl rounded-xl shadow-md p-4 sm:p-6 border border-[#2D7A66]/10 hover:shadow-lg transition-all duration-300 ${className}`}
    aria-label={title}
  >
    <div className="flex items-center gap-3 sm:gap-4">
      <div className={`text-[#2D7A66] ${iconSize}`}>{icon}</div>
      <div>
        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-[#144E53] truncate">
          {title}
        </h3>
        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-[#2D7A66]">
          {value}
        </p>
      </div>
    </div>
  </motion.div>
);

export default React.memo(SummaryCard);
