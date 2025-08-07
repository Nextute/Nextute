import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaPaperPlane,
} from "react-icons/fa";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const SupportPage = () => {
  // Dummy state for form and submission
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000); // Reset after 3s for demo
    setFormData({
      fullName: "",
      email: "",
      company: "",
      subject: "",
      message: "",
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
            Get in Touch
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            We’re here to assist you with any questions or concerns.
          </p>
        </motion.div>

        {/* Contact Info and Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-emerald-100/50 hover:shadow-2xl transition-all duration-300"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Contact Us
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="w-6 h-6 text-emerald-600 mt-1" />
                <div>
                  <h3 className="text-md font-medium text-gray-700">Address</h3>
                  <p className="text-sm text-gray-600">
                    Nextute EdTech Pvt. Ltd.
                    <br />
                    Village Chak Ahmad, Muzaffarpur, Bihar - 842001, India
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaPhoneAlt className="w-6 h-6 text-emerald-600 mt-1" />
                <div>
                  <h3 className="text-md font-medium text-gray-700">Phone</h3>
                  <p className="text-sm text-gray-600">+91-96992-25421</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaEnvelope className="w-6 h-6 text-emerald-600 mt-1" />
                <div>
                  <h3 className="text-md font-medium text-gray-700">Email</h3>
                  <p className="text-sm text-gray-600">Support@nextute.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaEnvelope className="w-6 h-6 text-emerald-600 mt-1" />
                <div>
                  <h3 className="text-md font-medium text-gray-700">
                    Office Hours
                  </h3>
                  <p className="text-sm text-gray-600">
                    Monday - Friday: 9:00 AM - 6:00 PM
                    <br />
                    Saturday: 9:00 AM - 1:00 PM
                    <br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-emerald-50 rounded-xl p-4 shadow-md border border-emerald-100"
              >
                <h3 className="text-md font-medium text-gray-700">
                  For Students
                </h3>
                <p className="text-sm text-gray-600">
                  Join wings and participation inquiries
                </p>
                <p className="text-sm text-emerald-600 mt-2">
                  Support@nextute.com
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-emerald-50 rounded-xl p-4 shadow-md border border-emerald-100"
              >
                <h3 className="text-md font-medium text-gray-700">
                  For Institute
                </h3>
                <p className="text-sm text-gray-600">
                  Partnerships and collaboration opportunities
                </p>
                <p className="text-sm text-emerald-600 mt-2">
                  Support@nextute.com
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-emerald-100/50 hover:shadow-2xl transition-all duration-300"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name *"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address *"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  required
                />
              </div>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company/Organization"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              />
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject *"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                required
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message *"
                className="w-full p-3 border border-gray-200 rounded-lg h-24 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none"
                required
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-emerald-600 text-white p-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all duration-200"
              >
                <FaPaperPlane /> Send Message
              </motion.button>
              <AnimatePresence>
                {isSubmitted && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-green-600 text-sm text-center mt-2"
                  >
                    Message sent successfully! We’ll get back to you soon.
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SupportPage;
