import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import SidePanel from "./SidePanel";
import Button from "../../ui/Button";
import InputField from "../../ui/InputField";
import SelectField from "../../ui/SelectField";
import Navbar from "../../Navbar.jsx";
import Footer from "../../Footer.jsx";

const AddBatch = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    details: "",
    feeRange: "",
    medium: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Welcome back popup
  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedAddBatch");
    if (hasVisited) {
      toast(
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <h3 className="text-lg font-semibold text-[#144E53]">
              Welcome Back!
            </h3>
            <p className="text-sm text-gray-600">
              Add a new batch to your institute.
            </p>
          </div>
        </div>,
        {
          duration: 3000,
          position: "top-center",
          style: {
            background: "#E6EDE2",
            color: "#144E53",
            borderRadius: "12px",
            padding: "16px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          },
        }
      );
    }
    localStorage.setItem("hasVisitedAddBatch", "true");
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Batch Name is required";
    if (!formData.category.trim()) errors.category = "Category is required";
    if (!formData.details.trim()) errors.details = "Details are required";
    if (!formData.feeRange.trim()) errors.feeRange = "Fee Range is required";
    else if (!/^\d+k-\d+k$/.test(formData.feeRange))
      errors.feeRange = "Enter a valid fee range (e.g., 4k-12k)";
    if (!formData.medium.trim()) errors.medium = "Medium is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setFormErrors((prev) => ({
        ...prev,
        form: "Please fill all required fields correctly",
      }));
      return;
    }
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Batch added successfully!", {
        position: "top-right",
        duration: 3000,
        style: { background: "#E6EDE2", color: "#144E53", borderRadius: "8px" },
      });
      navigate("/institute/batches");
    } catch (err) {
      toast.error("Failed to add batch", {
        position: "top-right",
        duration: 3000,
        style: { background: "#E6EDE2", color: "#144E53", borderRadius: "8px" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = [
    {
      label: "Batch Name",
      name: "name",
      type: "text",
      required: true,
      placeholder: "e.g., Batch 1",
    },
    {
      label: "Category",
      name: "category",
      type: "select",
      required: true,
      options: [
        { value: "", label: "Select Category" },
        { value: "regular", label: "Regular Course" },
        { value: "crash course", label: "Crash Course" },
        { value: "specialized course", label: "Specialized Course" },
      ],
    },
    {
      label: "Details",
      name: "details",
      type: "text",
      required: true,
      placeholder: "e.g., CUET Preparation",
    },
    {
      label: "Fee Range",
      name: "feeRange",
      type: "text",
      required: true,
      placeholder: "e.g., 4k-12k",
    },
    {
      label: "Medium",
      name: "medium",
      type: "select",
      required: true,
      options: [
        { value: "", label: "Select Medium" },
        { value: "english", label: "English" },
        { value: "hindi", label: "Hindi" },
        { value: "hinglish", label: "Hinglish" },
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#e5e7e4]">
      <Navbar />
      <div className="flex flex-1">
        <SidePanel />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/institute/batches")}
              className="p-2 bg-[#2D7A66] text-white rounded-full hover:bg-[#144E53] transition-all duration-300"
              aria-label="Back to Batches"
            >
              <ArrowLeft className="w-5 sm:w-6 h-5 sm:h-6" />
            </motion.div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#144E53] tracking-tight">
              Add New Batch
            </h1>
          </div>
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-[#2D7A66]/10"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {formFields.map(
                (
                  { label, name, type, required, options, placeholder },
                  index
                ) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {type === "select" ? (
                      <SelectField
                        label={label}
                        name={name}
                        value={formData[name]}
                        onChange={handleInputChange}
                        options={options}
                        error={formErrors[name]}
                        required={required}
                        className="w-full px-3 py-2.5 text-sm sm:text-base border border-[#2D7A66]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93E9A2] transition-all duration-300 bg-[#E6EDE2]"
                      />
                    ) : (
                      <InputField
                        label={label}
                        name={name}
                        type={type}
                        value={formData[name]}
                        onChange={handleInputChange}
                        error={formErrors[name]}
                        required={required}
                        placeholder={placeholder}
                        className="w-full px-3 py-2.5 text-sm sm:text-base border border-[#2D7A66]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93E9A2] transition-all duration-300 bg-[#E6EDE2]"
                      />
                    )}
                  </motion.div>
                )
              )}
            </div>
            {formErrors.form && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm text-center mt-4"
              >
                {formErrors.form}
              </motion.p>
            )}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="flex justify-between items-center mt-6 gap-4"
            >
              <Button
                variant="secondary"
                size="md"
                onClick={() => navigate("/institute/batches")}
                aria-label="Back to Batches"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button
                variant="primary"
                size="md"
                type="submit"
                disabled={isSubmitting}
                aria-label="Save and Submit"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 sm:h-5 w-4 sm:w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    Save & Submit <Save className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default AddBatch;
