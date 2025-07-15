import { useState, useRef, useCallback, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FiUpload } from "react-icons/fi";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import RegistrationNavigation from "../../components/Institute/RegistrationNavigation";
import { MdDelete } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";

// Set axios defaults to include credentials (cookies)
axios.defaults.withCredentials = true;

// Constants for validation
const VALIDATION_RULES = {
  institute_name: { required: true, message: "Institute name is required" },
  description: { required: true, message: "Description is required" },
  motto: { required: true, message: "Motto/Tagline is required" },
  establishedYear: {
    required: true,
    validate: (value) => {
      const year = parseInt(value, 10);
      const currentYear = new Date().getFullYear();
      return (
        (!isNaN(year) && year >= 1800 && year <= currentYear) ||
        "Valid established year is required (1800 - current year)"
      );
    },
  },
  medium: {
    required: true,
    validate: (value) =>
      value !== "" || "A medium of teaching must be selected",
  },
  exams: {
    required: true,
    validate: (value) =>
      value.length > 0 || "At least one exam must be selected",
  },
};

// Medium and Exam options
const TEACHING_MEDIUMS = ["online", "offline", "hybrid"];
const EXAM_OPTIONS = ["jee", "neet", "cuet", "upsc", "ssc", "other"];
const LOCAL_STORAGE_KEY = "instituteBasicInfoForm";
const LOCAL_STORAGE_LOGO_KEY = "instituteLogoPreview";

const BasicInfoPage = () => {
  const defaultFormData = {
    institute_name: "",
    description: "",
    logo: "",
    motto: "",
    establishedYear: "",
    medium: "",
    exams: [],
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [logoPreview, setLogoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLogoUploading, setIsLogoUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const fileInputRef = useRef(null);
  const { VITE_BACKEND_BASE_URL } = useContext(AppContext);
  const navigate = useNavigate();

  // Fetch saved data from backend on mount
  useEffect(() => {
    const fetchSavedData = async () => {
      try {
        const response = await axios.get(
          `${VITE_BACKEND_BASE_URL}/api/institutes/profile`
        );

        if (response.status === 200 && response.data.data.basic_info) {
          const savedData = JSON.parse(response.data.data.basic_info);
          setFormData({
            ...defaultFormData,
            ...savedData,
            medium:
              typeof savedData.medium === "string" ? savedData.medium : "",
            exams: Array.isArray(savedData.exams) ? savedData.exams : [],
          });
          setLogoPreview(savedData.logo || null);
          setIsEditing(false); // Read-only mode for saved data
        } else {
          console.log("No saved basic_info, starting fresh");
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          localStorage.removeItem(LOCAL_STORAGE_LOGO_KEY);
          setFormData(defaultFormData);
          setLogoPreview(null);
          setIsEditing(true);
        }
      } catch (error) {
        console.error("Failed to fetch saved data:", error);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        localStorage.removeItem(LOCAL_STORAGE_LOGO_KEY);
        setFormData(defaultFormData);
        setLogoPreview(null);
        setIsEditing(true);
      }
    };

    fetchSavedData();
  }, [VITE_BACKEND_BASE_URL]);

  // Save formData to localStorage only when editing
  useEffect(() => {
    if (isEditing) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData, isEditing]);

  // Save logoPreview to localStorage
  useEffect(() => {
    if (logoPreview && isEditing) {
      localStorage.setItem(LOCAL_STORAGE_LOGO_KEY, logoPreview);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_LOGO_KEY);
    }
  }, [logoPreview, isEditing]);

  // Validate form fields
  const validateForm = useCallback(() => {
    const newErrors = {};
    Object.entries(VALIDATION_RULES).forEach(([key, rule]) => {
      const value = formData[key];
      if (
        rule.required &&
        (value === "" || value === null || value.length === 0)
      ) {
        newErrors[key] = rule.message;
      } else if (rule.validate && value) {
        const validationResult = rule.validate(value);
        if (typeof validationResult === "string") {
          newErrors[key] = validationResult;
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handle input changes
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  // Handle medium радио button changes
  const handleMediumChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  // Handle exam checkbox changes
  const handleCheckboxChange = useCallback((e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked
        ? [...prev[name], value]
        : prev[name].filter((item) => item !== value),
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  // Handle logo upload
  const handleLogoUpload = useCallback(
    async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const fileURL = URL.createObjectURL(file);
      setLogoPreview(fileURL);
      setIsLogoUploading(true);

      try {
        const uploadFormData = new FormData();
        uploadFormData.append("image", file);

        const response = await axios.patch(
          `${VITE_BACKEND_BASE_URL}/api/institutes/upload/image`,
          uploadFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          const logoUrl = response.data.url || response.data.logoUrl || "";
          setFormData((prev) => ({ ...prev, logo: logoUrl }));
          setLogoPreview(logoUrl || fileURL);
          setErrors((prev) => ({ ...prev, logo: undefined }));
        }
      } catch (error) {
        console.error("Logo upload failed:", error);
        setFormData((prev) => ({ ...prev, logo: "" }));
        setErrors((prev) => ({
          ...prev,
          logo: error.response?.data?.message || "Failed to upload logo",
        }));
      } finally {
        setIsLogoUploading(false);
      }
    },
    [VITE_BACKEND_BASE_URL]
  );

  // Handle logo deletion
  const handleDeleteLogo = useCallback(() => {
    setFormData((prev) => ({ ...prev, logo: "" }));
    setLogoPreview(null);
    setErrors((prev) => ({ ...prev, logo: undefined }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validateForm() || isSubmitting) return;
      setIsSubmitting(true);

      try {
        const response = await axios.patch(
          `${VITE_BACKEND_BASE_URL}/api/institutes/me/basic-info`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Data send successfully", formData);
        
        if (response.status === 200) {
          // localStorage.removeItem(LOCAL_STORAGE_KEY);
          // localStorage.removeItem(LOCAL_STORAGE_LOGO_KEY);
          navigate("/institute/contact");
        }
      } catch (error) {
        console.error("Form submission failed:", error);
        setErrors({
          submit: error.response?.data?.message || "Failed to submit form",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, isSubmitting, navigate, validateForm, VITE_BACKEND_BASE_URL]
  );

  // Handle edit button click
  const handleEditClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  // Handle logo upload click
  const handleIconClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="min-h-screen p-5 bg-[#E4EEE3]">
      <RegistrationNavigation />
      <div className="px-3 py-4 border border-gray-300 bg-white rounded-3xl shadow-lg">
        <form className="grid grid-cols-1 sm:grid-cols-6 gap-4">
          <div className="bg-white border border-gray-300 col-span-1 sm:col-span-4 rounded-xl p-4">
            <label className="text-gray-800 text-lg px-2 font-semibold mb-2 block">
              Name
            </label>
            <input
              className={`w-full text-gray-900 ${
                isEditing ? "bg-gray-200" : "bg-gray-50"
              } rounded-xl text-base font-medium p-2 sm:px-4 sm:py-3 border-none outline-none focus:ring-2 focus:ring-[#2D7A66] `}
              type="text"
              name="institute_name"
              value={formData.institute_name}
              onChange={handleInputChange}
              placeholder="Enter Your Institute Name"
              aria-invalid={!!errors.name}
              disabled={!isEditing}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div className="bg-white border border-gray-300 col-span-1 sm:col-span-4 rounded-xl p-4">
            <label className="text-gray-800 text-lg px-2 font-semibold mb-2 block">
              Description
            </label>
            <textarea
              rows="5"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`w-full text-gray-900 ${
                isEditing ? "bg-gray-200" : "bg-gray-50"
              } rounded-xl text-base font-medium p-2 sm:px-4 sm:py-3 border-none outline-none focus:ring-2 focus:ring-[#2D7A66] resize-none`}
              placeholder="About Your Institute"
              aria-invalid={!!errors.description}
              disabled={!isEditing}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>
          <div className="relative bg-white border border-gray-300 col-span-1 sm:col-span-2 rounded-xl p-4 sm:row-span-2 sm:row-start-1 sm:col-start-5 sm:col-end-7">
            <label className="text-gray-800 text-lg font-semibold mb-2 block">
              Institute Logo
            </label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleLogoUpload}
              className="hidden"
              aria-invalid={!!errors.logo}
              disabled={!isEditing}
            />
            {isLogoUploading ? (
              <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg space-x-3">
                <svg
                  className="animate-spin h-6 w-6 text-gray-700"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
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
                <span className="text-[#2D7A66] font-medium text-lg">
                  Uploading Logo...
                </span>
              </div>
            ) : logoPreview ? (
              <div className="flex flex-col items-center space-y-3">
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  className="w-full h-48 object-contain rounded-lg cursor-pointer"
                  onClick={isEditing ? handleIconClick : null}
                />
                {isEditing && (
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={handleDeleteLogo}
                      className="px-4 py-1 rounded-xl border border-red-500 text-red-500 hover:bg-red-50 transition"
                    >
                      <MdDelete size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={handleIconClick}
                      className="px-4 py-1 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
                    >
                      Upload New
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div
                className={`flex justify-center items-center h-48 border-2 border-dashed border-gray-300 rounded-lg transition ${
                  isEditing
                    ? "cursor-pointer hover:border-gray-500"
                    : "cursor-not-allowed"
                }`}
                onClick={isEditing ? handleIconClick : null}
              >
                <FiUpload className="text-4xl text-gray-600" />
              </div>
            )}
            {errors.logo && (
              <p className="text-red-500 text-sm mt-2" role="alert">
                {errors.logo}
              </p>
            )}
          </div>
          <div className="bg-white border border-gray-300 col-span-1 sm:col-span-6 rounded-xl p-4">
            <label className="text-gray-800 text-lg p-2 font-semibold mb-2 block">
              Motto/Tagline
            </label>
            <input
              className={`w-full text-gray-900 ${
                isEditing ? "bg-gray-200" : "bg-gray-50"
              } rounded-xl text-base font-medium p-2 sm:px-4 sm:py-3 border-none outline-none focus:ring-2 focus:ring-[#2D7A66] `}
              type="text"
              name="motto"
              value={formData.motto}
              onChange={handleInputChange}
              placeholder="A tagline that represents your vision"
              aria-invalid={!!errors.motto}
              disabled={!isEditing}
            />
            {errors.motto && (
              <p className="text-red-500 text-sm mt-1">{errors.motto}</p>
            )}
          </div>
          <div className="bg-white border border-gray-300 col-span-1 sm:col-span-2 rounded-xl p-4">
            <label className="text-gray-800 text-lg px-2 font-semibold mb-2 block">
              Established Year
            </label>
            <input
              className={`w-full text-gray-900 ${
                isEditing ? "bg-gray-200" : "bg-gray-50"
              } rounded-xl text-base font-medium p-2 sm:px-4 sm:py-3 border-none outline-none focus:ring-2 focus:ring-[#2D7A66] `}
              type="number"
              min={1800}
              max={new Date().getFullYear()}
              name="establishedYear"
              value={formData.establishedYear}
              onChange={handleInputChange}
              placeholder="Founding Year"
              aria-invalid={!!errors.establishedYear}
              disabled={!isEditing}
            />
            {errors.establishedYear && (
              <p className="text-red-500 text-sm mt-1">
                {errors.establishedYear}
              </p>
            )}
          </div>
          <div className="bg-white border border-gray-300 col-span-1 sm:col-span-2 rounded-xl p-4">
            <label className="text-gray-800 text-lg px-2 font-semibold mb-2 block">
              Medium of Teaching
            </label>
            <div className="flex flex-col px-2 py-1 gap-2">
              {TEACHING_MEDIUMS.map((medium) => (
                <label key={medium} className="inline-flex items-center">
                  <input
                    type="radio"
                    name="medium"
                    value={medium}
                    onChange={handleMediumChange}
                    checked={formData.medium === medium}
                    className="accent-[#2D7A66] focus:ring-[#2D7A66]"
                    disabled={!isEditing}
                  />
                  <span className="ml-2 text-sm text-gray-900 font-medium">
                    {medium.charAt(0).toUpperCase() + medium.slice(1)}
                  </span>
                </label>
              ))}
            </div>
            {errors.medium && (
              <p className="text-red-500 text-sm mt-2">{errors.medium}</p>
            )}
          </div>
          <div className="bg-white border border-gray-300 col-span-1 sm:col-span-2 rounded-xl p-4">
            <label className="text-gray-800 text-lg px-2 font-semibold mb-2 block">
              Exams Targeted
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 px-2 py-1 gap-2">
              {EXAM_OPTIONS.map((exam) => (
                <label key={exam} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="exams"
                    value={exam}
                    onChange={handleCheckboxChange}
                    checked={formData.exams.includes(exam)}
                    className="accent-[#2D7A66] focus:ring-[#2D7A66]"
                    disabled={!isEditing}
                  />
                  <span className="ml-2 text-sm text-gray-900 font-medium">
                    {exam.toUpperCase()}
                  </span>
                </label>
              ))}
            </div>
            {errors.exams && (
              <p className="text-red-500 text-sm mt-2">{errors.exams}</p>
            )}
          </div>
        </form>
      </div>
      <div className="flex items-center justify-center sm:justify-end p-4 mt-4">
        {!isEditing ? (
          <button
            type="button"
            onClick={handleEditClick}
            className="flex items-center px-6 py-2 rounded-full text-white font-medium bg-[#204B54] hover:bg-[#2D7B67] transition"
          >
            Edit
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || isLogoUploading}
            className={`flex items-center px-6 py-2 rounded-full text-white font-medium transition ${
              isSubmitting || isLogoUploading
                ? "bg-[#2D7B67] cursor-not-allowed"
                : "bg-[#204B54]"
            }`}
          >
            {isSubmitting ? "Saving..." : "Save & Next"}
            {!isSubmitting && <FaArrowRight className="ml-2" />}
          </button>
        )}
      </div>
      {errors.submit && (
        <p className="text-red-500 text-sm text-center mt-2">{errors.submit}</p>
      )}
    </div>
  );
};

export default BasicInfoPage;
