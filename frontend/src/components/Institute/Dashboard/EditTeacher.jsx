import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Upload, Trash2 } from "lucide-react";
import SidePanel from "./SidePanel.jsx";
import { useInstituteData } from "../../../hooks/useInstituteData.js";
import { assets } from "../../../assets/assets.js";
import Button from "../../ui/Button";
import InputField from "../../ui/InputField";
import SelectField from "../../ui/SelectField";
import Navbar from "../../Navbar.jsx";
import Footer from "../../Footer.jsx";
import LoadingSpinner from "../../LoadingSpinner.jsx";

const EditTeacher = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { instituteDashboardData, dataLoading, error, hasRenderedOnce } =
    useInstituteData();
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    subject: "",
    experience: "",
    qualification: "",
    contact: "",
    email: "",
    gender: "",
    photo: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Load teacher data
  useEffect(() => {
    if (instituteDashboardData && hasRenderedOnce) {
      try {
        const facultyData = JSON.parse(
          JSON.parse(instituteDashboardData.faculty_details).faculties
        );
        const teacher = facultyData.find((t) => (t.id || t.contact) === id);
        if (teacher) {
          setFormData({
            firstName: teacher.firstName || "",
            middleName: teacher.middleName || "",
            lastName: teacher.lastName || "",
            subject: teacher.subject || "",
            experience: teacher.experience || "",
            qualification: teacher.qualification || "",
            contact: teacher.contact || "",
            email: teacher.email || "",
            gender: teacher.gender || "",
            photo: teacher.photo || null,
          });
          setPhotoPreview(teacher.photo || null);
        } else {
          toast.error("Teacher not found", {
            position: "top-right",
            duration: 3000,
            style: {
              background: "#E6EDE2",
              color: "#144E53",
              borderRadius: "8px",
            },
          });
          navigate("/institute/teachers");
        }
      } catch (err) {
        toast.error("Error loading teacher data", {
          position: "top-right",
          duration: 3000,
          style: {
            background: "#E6EDE2",
            color: "#144E53",
            borderRadius: "8px",
          },
        });
        navigate("/institute/teachers");
      }
    }
  }, [instituteDashboardData, id, hasRenderedOnce, navigate]);

  // Loading and error states
  if (dataLoading || !hasRenderedOnce) return <LoadingSpinner />;
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#E6EDE2] text-red-600 text-lg sm:text-xl font-semibold">
        Error loading teacher data. Please try again.
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/png", "image/jpeg"];
      if (!validTypes.includes(file.type)) {
        setFormErrors((prev) => ({
          ...prev,
          photo: "Please upload a valid image (PNG/JPG)",
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors((prev) => ({ ...prev, photo: "File size exceeds 5MB" }));
        return;
      }
      setFormData((prev) => ({ ...prev, photo: file }));
      setPhotoPreview(URL.createObjectURL(file));
      setFormErrors((prev) => ({ ...prev, photo: "" }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const validTypes = ["image/png", "image/jpeg"];
      if (!validTypes.includes(file.type)) {
        setFormErrors((prev) => ({
          ...prev,
          photo: "Please upload a valid image (PNG/JPG)",
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors((prev) => ({ ...prev, photo: "File size exceeds 5MB" }));
        return;
      }
      setFormData((prev) => ({ ...prev, photo: file }));
      setPhotoPreview(URL.createObjectURL(file));
      setFormErrors((prev) => ({ ...prev, photo: "" }));
    }
  };

  const handleDeletePhoto = () => {
    setFormData((prev) => ({ ...prev, photo: null }));
    setPhotoPreview(null);
    setFormErrors((prev) => ({ ...prev, photo: "" }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = "First Name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last Name is required";
    if (!formData.subject.trim()) errors.subject = "Subject is required";
    if (!formData.experience.trim())
      errors.experience = "Experience is required";
    else if (!/^\d+(\.\d+)?\s*(years?|yrs?)$/i.test(formData.experience))
      errors.experience = "Enter valid experience (e.g., 5 years)";
    if (!formData.qualification.trim())
      errors.qualification = "Qualification is required";
    if (!formData.contact.trim()) errors.contact = "Contact is required";
    if (!/^\+?\d{10,12}$/.test(formData.contact))
      errors.contact = "Invalid contact number";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Invalid email format";
    if (!formData.gender.trim()) errors.gender = "Gender is required";
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
      toast.success("Teacher updated successfully!", {
        position: "top-right",
        duration: 3000,
        style: { background: "#E6EDE2", color: "#144E53", borderRadius: "8px" },
      });
      navigate("/institute/teachers");
    } catch (err) {
      toast.error("Failed to update teacher", {
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
      label: "First Name",
      name: "firstName",
      type: "text",
      required: true,
      placeholder: "e.g., John",
    },
    {
      label: "Middle Name",
      name: "middleName",
      type: "text",
      placeholder: "e.g., Michael",
    },
    {
      label: "Last Name",
      name: "lastName",
      type: "text",
      required: true,
      placeholder: "e.g., Doe",
    },
    {
      label: "Subject",
      name: "subject",
      type: "text",
      required: true,
      placeholder: "e.g., Mathematics",
    },
    {
      label: "Experience",
      name: "experience",
      type: "text",
      required: true,
      placeholder: "e.g., 5 years",
    },
    {
      label: "Qualification",
      name: "qualification",
      type: "text",
      required: true,
      placeholder: "e.g., M.Sc. Physics",
    },
    {
      label: "Contact",
      name: "contact",
      type: "tel",
      required: true,
      placeholder: "e.g., +1234567890",
    },
    {
      label: "Email",
      name: "email",
      type: "email",
      required: true,
      placeholder: "e.g., john.doe@example.com",
    },
    {
      label: "Gender",
      name: "gender",
      type: "select",
      required: true,
      options: [
        { value: "", label: "Select Gender" },
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" },
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
              onClick={() => navigate("/institute/teachers")}
              className="p-2 bg-[#2D7A66] text-white rounded-full hover:bg-[#144E53] transition-all duration-300"
              aria-label="Back to Teachers"
            >
              <ArrowLeft className="w-5 sm:w-6 h-5 sm:h-6" />
            </motion.div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#144E53] tracking-tight">
              Edit Teacher
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
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.9 }}
                className="sm:col-span-3 flex flex-col items-center"
              >
                <label className="block text-sm font-medium text-[#144E53] mb-2">
                  Teacher Photo <span className="text-red-500">*</span>
                </label>
                <motion.div
                  whileHover={{ scale: photoPreview ? 1 : 1.02 }}
                  className={`w-32 h-32 sm:w-60 sm:h-40 border border-[#2D7A66]/20 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 ${
                    dragOver
                      ? "bg-[#93E9A2] border-dashed border-2"
                      : "bg-[#E6EDE2]"
                  }`}
                  onClick={() => !photoPreview && fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                >
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Teacher Preview"
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => (e.target.src = assets.Not_found)}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="text-2xl sm:text-3xl text-[#144E53]" />
                      <p className="text-xs sm:text-sm text-[#144E53]">
                        Drag & drop or click to upload
                      </p>
                    </div>
                  )}
                </motion.div>
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  aria-label="Upload Teacher Photo"
                />
                {photoPreview && (
                  <div className="flex gap-3 mt-3">
                    <Button
                      variant="danger"
                      onClick={handleDeletePhoto}
                      className="text-xs sm:text-sm"
                      aria-label="Delete Photo"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs sm:text-sm"
                      aria-label="Upload New Photo"
                    >
                      <Upload className="w-4 h-4" /> Upload New
                    </Button>
                  </div>
                )}
                {formErrors.photo && (
                  <p className="text-red-500 text-sm mt-2">
                    {formErrors.photo}
                  </p>
                )}
              </motion.div>
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
              transition={{ duration: 0.3, delay: 1 }}
              className="flex justify-between items-center mt-6 gap-4"
            >
              <Button
                variant="secondary"
                onClick={() => navigate("/institute/teachers")}
                className="text-xs sm:text-sm"
                aria-label="Back to Teachers"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
                className="text-xs sm:text-sm"
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

export default EditTeacher;
