import { useState, useCallback, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import Cookies from "js-cookie";
import RegistrationNavigation from "../../components/Institute/RegistrationNavigation";
import MapSelector from "../../components/MapSelector";

// Validation rules
const VALIDATION_RULES = {
  headOffice: {
    address: { required: true, message: "Head Office address is required" },
    state: { required: true, message: "State is required" },
    city: { required: true, message: "City is required" },
    pinCode: {
      required: true,
      validate: (value) =>
        /^\d{6}$/.test(value) || "Valid 6-digit Pin Code is required",
    },
    landmark: { required: false },
    // location: { required: true, message: "Head Office location is required" },
  },
  branch: {
    address: {
      required: false,
      validate: (value, formData) =>
        !value && Object.values(formData.branch).some((v) => v.trim())
          ? "Branch address is required if any branch field is provided"
          : true,
    },
    state: {
      required: false,
      validate: (value, formData) =>
        !value && Object.values(formData.branch).some((v) => v.trim())
          ? "State is required if any branch field is provided"
          : true,
    },
    city: {
      required: false,
      validate: (value, formData) =>
        !value && Object.values(formData.branch).some((v) => v.trim())
          ? "City is required if any branch field is provided"
          : true,
    },
    pinCode: {
      required: false,
      validate: (value, formData) =>
        Object.values(formData.branch).some((v) => v.trim())
          ? /^\d{6}$/.test(value) ||
            "Valid 6-digit Pin Code is required if any branch field is provided"
          : true,
    },
    landmark: { required: false },
    // location: {
    //   required: false,
    //   validate: (value, formData) =>
    //     !value && Object.values(formData.branch).some((v) => v.trim())
    //       ? "Branch location is required if any branch field is provided"
    //       : true,
    // },
  },
};

const LOCAL_STORAGE_KEY = "instituteContactForm";
const PROGRESS_KEY = "instituteProgress";

const ContactPage = () => {
  const defaultFormData = {
    headOffice: {
      address: "",
      state: "",
      city: "",
      pinCode: "",
      landmark: "",
      location: "",
    },
    branch: {
      address: "",
      state: "",
      city: "",
      pinCode: "",
      landmark: "",
      location: "",
    },
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(true); // Start in edit mode by default
  const { VITE_BACKEND_BASE_URL } = useContext(AppContext);
  const navigate = useNavigate();

  // Load data from localStorage on mount
  useEffect(() => {
    console.log("Component mounted, checking localStorage...");
    const savedFormData = localStorage.getItem(LOCAL_STORAGE_KEY);
    const progress = localStorage.getItem(PROGRESS_KEY);

    if (savedFormData) {
      try {
        const parsed = JSON.parse(savedFormData);
        console.log("Retrieved form data from localStorage:", parsed);
        setFormData({
          ...defaultFormData,
          ...parsed,
          headOffice: {
            ...defaultFormData.headOffice,
            ...parsed.headOffice,
          },
          branch: {
            ...defaultFormData.branch,
            ...parsed.branch,
          },
        });
        // Set isEditing to false only if user has progressed to /institute/courses
        if (progress === "courses") {
          console.log("User navigated back from courses, disabling edit mode");
          setIsEditing(false);
        }
      } catch (e) {
        console.error("Failed to parse saved form data from localStorage:", e);
        setFormData(defaultFormData);
      }
    } else {
      console.log("No form data found in localStorage");
    }
  }, []);

  // Save formData to localStorage whenever it changes
  useEffect(() => {
    console.log("Saving form data to localStorage:", formData);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const validateForm = useCallback(() => {
    console.log("Form data before validation:", formData); // Debug formData
    const newErrors = {};

    Object.entries(VALIDATION_RULES.headOffice).forEach(([key, rule]) => {
      const value = formData.headOffice[key];
      if (rule.required && !value.trim()) {
        newErrors[`headOffice${key}`] = rule.message;
      } else if (rule.validate && value) {
        const result = rule.validate(value, formData);
        if (typeof result === "string") newErrors[`headOffice${key}`] = result;
      }
    });

    if (Object.values(formData.branch).some((v) => v.trim())) {
      Object.entries(VALIDATION_RULES.branch).forEach(([key, rule]) => {
        const value = formData.branch[key];
        const result = rule.validate ? rule.validate(value, formData) : true;
        if (typeof result === "string") newErrors[`branch${key}`] = result;
      });
    }

    setErrors(newErrors);
    console.log("Validation errors:", newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((e, section) => {
    const { name, value } = e.target;
    console.log(`Input changed: ${section}.${name} = ${value}`);
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [name]: value },
    }));
    setErrors((prev) => ({ ...prev, [`${section}${name}`]: undefined }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      console.log("Attempting form submission..."); // Debug submission start
      if (!validateForm() || isSubmitting) {
        console.log("Form validation failed or already submitting");
        return;
      }

      setIsSubmitting(true);
      console.log("Submission started, isSubmitting set to true");
      try {
        const token = Cookies.get("authToken");
        console.log("Submitting form data to API:", formData);
        const response = await axios.patch(
          `${VITE_BACKEND_BASE_URL}/api/institutes/me/contact`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          console.log(
            "Form submitted successfully, navigating to courses page"
          );
          localStorage.setItem(PROGRESS_KEY, "courses");
          navigate("/institute/courses");
        }
      } catch (error) {
        console.error("Form submission failed:", error);
        setErrors({
          submit: error.response?.data?.message || "Failed to submit form",
        });
      } finally {
        setIsSubmitting(false);
        console.log("Submission ended, isSubmitting set to false");
      }
    },
    [formData, isSubmitting, navigate, validateForm, VITE_BACKEND_BASE_URL]
  );

  const handleEditClick = useCallback(() => {
    console.log("Edit button clicked, enabling form");
    setIsEditing(true);
  }, []);

  const renderAddressSection = (section, title) => (
    <div className="bg-white border border-gray-300 col-span-6 rounded-xl p-4">
      <label className="text-gray-800 text-lg px-4 font-semibold mb-2 block">
        {title}
      </label>
      <textarea
        rows={3}
        className="w-full text-gray-900 text-base border-none px-4 py-2 outline-none focus:ring-2 focus:ring-[#2D7A66] rounded resize-none"
        name="address"
        placeholder="Full address"
        value={formData[section].address}
        onChange={(e) => handleInputChange(e, section)}
        disabled={!isEditing}
      />
      {errors[`${section}address`] && (
        <p className="text-red-500 text-sm mt-1">
          {errors[`${section}address`]}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-8">
        {["state", "city", "pinCode", "landmark"].map((field) => (
          <div key={field}>
            <input
              name={field}
              value={formData[section][field]}
              onChange={(e) => handleInputChange(e, section)}
              placeholder={
                field === "pinCode"
                  ? "Pin Code"
                  : field.charAt(0).toUpperCase() + field.slice(1)
              }
              className="w-full text-gray-900 text-base px-4 py-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-[#2D7A66]"
              disabled={!isEditing}
            />
            {errors[`${section}${field}`] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[`${section}${field}`]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-5 bg-[#E4EEE3]">
      <RegistrationNavigation />

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-6 gap-3 space-y-3 bg-white border border-gray-300 rounded-3xl shadow-lg px-3 py-4"
      >
        {/* Head Office Section */}
        <div className="sm:col-span-4 flex flex-col mt-3 gap-4">
          {renderAddressSection("headOffice", "Head Office Address")}
        </div>
        <div className="sm:col-span-2 flex flex-col gap-4">
          <MapSelector
            position={formData.headOffice.location}
            setPosition={(pos) => {
              if (!isEditing) return; // Prevent updates when not editing
              console.log(`Setting headOffice location: ${pos}`); // Debug MapSelector
              setFormData((prev) => ({
                ...prev,
                headOffice: { ...prev.headOffice, location: pos },
              }));
              setErrors((prev) => ({
                ...prev,
                "headOffice.location": undefined,
              }));
            }}
            disabled={!isEditing}
          />
          {errors.headOfficelocation && (
            <p className="text-red-500 text-sm mt-1">
              {errors.headOfficelocation}
            </p>
          )}
        </div>

        {/* Branch Section */}
        <div className="sm:col-span-4 flex flex-col gap-4">
          {renderAddressSection("branch", "Branch Address (Optional)")}
        </div>
        <div className="sm:col-span-2 flex flex-col gap-4">
          <MapSelector
            position={formData.branch.location}
            setPosition={(pos) => {
              if (!isEditing) return; // Prevent updates when not editing
              console.log(`Setting branch location: ${pos}`); // Debug MapSelector
              setFormData((prev) => ({
                ...prev,
                branch: { ...prev.branch, location: pos },
              }));
              setErrors((prev) => ({
                ...prev,
                branchlocation: undefined,
              }));
            }}
            disabled={!isEditing}
          />
          {errors.branchlocation && (
            <p className="text-red-500 text-sm mt-1">{errors.branchlocation}</p>
          )}
        </div>
      </form>

      {/* Navigation */}
      <div className="flex justify-between items-center p-4 mt-4">
        <button
          type="button"
          onClick={() => navigate("/institute/basic-info")}
          className="flex items-center bg-[#204B54] text-white border border-[#2D7A66] px-6 py-2 rounded-full"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
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
            disabled={isSubmitting}
            className={`flex items-center px-6 py-2 rounded-full text-white font-medium transition ${
              isSubmitting ? "bg-[#2D7B67] cursor-not-allowed" : "bg-[#204B54]"
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

export default ContactPage;
