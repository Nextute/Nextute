import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaUserCircle, FaPaperPlane } from "react-icons/fa";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const StudentFeedbackDashboard = () => {
  // Dummy data (replace with API call in production)
  const [ratings] = useState({
    usability: 4.2,
    testPrepTools: 4.4,
    counseling: 4.3,
    support: 4.0,
  });
  const [averageRating] = useState(4.3);
  const [studentSatisfaction] = useState(88);
  const [testimonials] = useState([
    {
      id: 1,
      name: "Arjun Mehra",
      program: "JEE Advanced",
      rating: 4.6,
      feedback:
        "The mock tests and personalized study plans are exceptional. Highly recommend!",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: 2,
      name: "Sneha Patel",
      program: "NEET Prep",
      rating: 4.7,
      feedback:
        "Incredible support from mentors. The doubt-clearing sessions are a game-changer.",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    {
      id: 3,
      name: "Rohan Singh",
      program: "CAT Prep",
      rating: 4.4,
      feedback:
        "Well-structured content and great practice questions. Excellent platform!",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
  ]);
  const [feedback, setFeedback] = useState({
    name: "",
    program: "",
    helpfulness: 0,
    experience: 0,
    comments: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Render star rating component
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`w-5 h-5 ${
          i < Math.floor(rating)
            ? "text-yellow-400"
            : i < rating
            ? "text-yellow-400/50"
            : "text-gray-300"
        } transition-colors duration-200`}
      />
    ));
  };

  // Handle feedback form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000); // Reset after 3s for demo
    setFeedback({
      name: "",
      program: "",
      helpfulness: 0,
      experience: 0,
      comments: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-gray-100 font-sans">
        <Navbar />
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Student Feedback Hub
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Share your insights and help us elevate your learning journey.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
          {/* Overall Ratings */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-emerald-100/50 hover:shadow-2xl transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Overall Ratings
            </h2>
            <div className="space-y-3">
              <p className="text-sm text-gray-600 flex items-center">
                Usability {renderStars(ratings.usability)}{" "}
                <span className="ml-2 text-gray-900 font-medium">
                  {ratings.usability.toFixed(1)}
                </span>
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                Test Prep Tools {renderStars(ratings.testPrepTools)}{" "}
                <span className="ml-2 text-gray-900 font-medium">
                  {ratings.testPrepTools.toFixed(1)}
                </span>
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                Counseling {renderStars(ratings.counseling)}{" "}
                <span className="ml-2 text-gray-900 font-medium">
                  {ratings.counseling.toFixed(1)}
                </span>
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                Support {renderStars(ratings.support)}{" "}
                <span className="ml-2 text-gray-900 font-medium">
                  {ratings.support.toFixed(1)}
                </span>
              </p>
            </div>
          </motion.div>

          {/* Average Rating */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-emerald-100/50 hover:shadow-2xl transition-all duration-300 flex flex-col items-center"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Average Rating
            </h2>
            <div className="text-5xl font-bold text-emerald-600 mb-2">
              {averageRating}
            </div>
            <div className="flex mb-2">{renderStars(averageRating)}</div>
            <p className="text-sm text-gray-500">
              Based on {testimonials.length} reviews
            </p>
          </motion.div>

          {/* Student Satisfaction */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-emerald-100/50 hover:shadow-2xl transition-all duration-300 flex flex-col items-center"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Student Satisfaction
            </h2>
            <div className="text-5xl font-bold text-blue-600 mb-2">
              {studentSatisfaction}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-blue-600 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${studentSatisfaction}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">Students recommend us</p>
          </motion.div>

          {/* Feedback Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-emerald-100/50 hover:shadow-2xl transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Share Your Feedback
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={feedback.name}
                onChange={(e) =>
                  setFeedback({ ...feedback, name: e.target.value })
                }
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                required
              />
              <input
                type="text"
                placeholder="Program (e.g., JEE, NEET)"
                value={feedback.program}
                onChange={(e) =>
                  setFeedback({ ...feedback, program: e.target.value })
                }
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                required
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Helpfulness:</span>
                <div className="flex gap-1">
                  {renderStars(feedback.helpfulness).map((star, i) => (
                    <span
                      key={i}
                      onClick={() =>
                        setFeedback({ ...feedback, helpfulness: i + 1 })
                      }
                      className="cursor-pointer"
                    >
                      {star}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Experience:</span>
                <div className="flex gap-1">
                  {renderStars(feedback.experience).map((star, i) => (
                    <span
                      key={i}
                      onClick={() =>
                        setFeedback({ ...feedback, experience: i + 1 })
                      }
                      className="cursor-pointer"
                    >
                      {star}
                    </span>
                  ))}
                </div>
              </div>
              <textarea
                placeholder="Share your experience..."
                value={feedback.comments}
                onChange={(e) =>
                  setFeedback({ ...feedback, comments: e.target.value })
                }
                className="w-full p-3 border border-gray-200 rounded-lg h-24 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none"
                required
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-emerald-600 text-white p-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all duration-200"
              >
                <FaPaperPlane /> Submit Feedback
              </motion.button>
              <AnimatePresence>
                {isSubmitted && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-green-600 text-sm text-center mt-2"
                  >
                    Thank you for your feedback!
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            What Our Students Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: testimonial.id * 0.1 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-emerald-100/50 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-200"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {testimonial.program}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  {testimonial.feedback}
                </p>
                <div className="flex gap-1">
                  {renderStars(testimonial.rating)}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default StudentFeedbackDashboard;
