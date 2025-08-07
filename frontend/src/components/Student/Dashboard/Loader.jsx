import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Loader = ({ isLoading, completion }) => {
  const [animatedCompletion, setAnimatedCompletion] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      let start = 0;
      const duration = 1500;
      const increment = completion / (duration / 16);
      const animate = () => {
        start += increment;
        if (start >= completion) {
          setAnimatedCompletion(completion);
          return;
        }
        setAnimatedCompletion(start);
        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [isLoading, completion]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28"
      aria-label="Profile Completion Loader"
    >
      {isLoading ? (
        <div className="w-full h-full bg-gray-200 animate-pulse rounded-full"></div>
      ) : (
        <>
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              className="text-gray-200"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
            />
            {/* Animated foreground circle */}
            <motion.circle
              className="text-teal-700"
              strokeWidth="8"
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
              transform="rotate(-90 50 50)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: animatedCompletion / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-gray-800 font-semibold text-sm sm:text-base md:text-lg lg:text-xl">
            {Math.round(animatedCompletion)}%
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Loader;
