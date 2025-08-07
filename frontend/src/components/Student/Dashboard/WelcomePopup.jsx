import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

const WelcomePopup = ({ name, onClose }) => {
  useEffect(() => {
    const duration = Math.random() * 3000;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer); // Cleanup on unmount
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      >
        <motion.div
          className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-8 max-w-md w-full mx-4 bg-opacity-90 backdrop-blur-lg shadow-xl"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
        >
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-200 transition"
            ></motion.button>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-teal-500" />
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome, {name || "Student"}! 🎉
            </h2>
          </div>
          <p className="text-gray-600 mb-6 text-lg">
            We're thrilled to have you back on your learning journey with
            Nextute!🎊🎗️ <br />
            Explore your personalized dashboard and soar to new heights!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg hover:from-teal-600 hover:to-blue-700 transition shadow-md w-full"
          >
            Get Started
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WelcomePopup;
