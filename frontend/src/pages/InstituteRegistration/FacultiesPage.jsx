import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
} from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import RegistrationNavigation from "../../components/Institute/RegistrationNavigation";
import axios from "axios";
import Cookies from "js-cookie";
import { AppContext } from "../../context/AppContext";

// ✅ DEFAULT FACULTY OBJECT (Removed media field)
const defaultFaculty = {
  firstName: "",
  middleName: "",
  lastName: "",
  gender: "",
  contact: "",
  email: "",
  subject: "",
  experience: "",
  qualification: "",
  salary: "",
  photo: null,
};

const LOCAL_STORAGE_KEY = "instituteFacultiesForm";
const PROGRESS_KEY = "instituteProgress";

const FacultiesPage = () => {
  const [faculties, setFaculties] = useState([{ ...defaultFaculty }]);
  const [mediaPreview, setMediaPreview] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const fileInputRefs = useRef([]);
  const { VITE_BACKEND_BASE_URL } = useContext(AppContext);
  const navigate = useNavigate();

  // ✅ Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    const progress = localStorage.getItem(PROGRESS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFaculties(parsed.length > 0 ? parsed : [{ ...defaultFaculty }]);
        setMediaPreview(
          parsed.map((f) =>
            f.photo && typeof f.photo === "string" ? f.photo : null
          )
        );
        if (progress === "achievements") setIsEditing(false);
      } catch {
        setFaculties([{ ...defaultFaculty }]);
        setMediaPreview([null]);
      }
    } else {
      setMediaPreview([null]);
    }
  }, []);

  // ✅ Save to localStorage
  useEffect(() => {
    console.log("Saving courses to localStorage:", faculties);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(faculties));
  }, [faculties]);

  const toggleExpand = useCallback((index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    let hasValidFaculty = false;

    faculties.forEach((f, i) => {
      const e = {};
      if (
        f.firstName.trim() ||
        f.lastName.trim() ||
        f.gender ||
        f.contact ||
        f.email ||
        f.subject ||
        f.experience ||
        f.qualification
      ) {
        if (!f.firstName.trim()) e.firstName = "First Name is required";
        if (!f.lastName.trim()) e.lastName = "Last Name is required";
        if (!f.gender) e.gender = "Select a gender";
        if (!/^\d{10}$/.test(f.contact))
          e.contact = "10-digit contact required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
          e.email = "Valid email required";
        if (!f.subject.trim()) e.subject = "Subject is required";
        if (isNaN(f.experience) || f.experience < 0)
          e.experience = "Valid experience required";
        if (!f.qualification.trim())
          e.qualification = "Qualification is required";
      }
      if (Object.keys(e).length === 0 && f.firstName.trim())
        hasValidFaculty = true;
      if (Object.keys(e).length > 0) newErrors[`faculty${i}`] = e;
    });

    if (!hasValidFaculty)
      newErrors.form = "At least one faculty must be fully filled";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [faculties]);

  const handleInputChange = useCallback((index, field, value) => {
    setFaculties((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    setErrors((prev) => ({
      ...prev,
      [`faculty${index}`]: { ...prev[`faculty${index}`], [field]: undefined },
    }));
  }, []);

  const handlePhotoChange = useCallback(
    (index, event) => {
      const file = event.target.files[0];
      if (file) {
        handleInputChange(index, "photo", file); // Store file in 'photo' field
        try {
          const url = URL.createObjectURL(file);
          setMediaPreview((prev) => {
            const updated = [...prev];
            updated[index] = url;
            return updated;
          });
        } catch (err) {
          console.error("Invalid image for preview:", err);
        }
      }
    },
    [handleInputChange]
  );

  const handleDeletePhoto = useCallback(
    (index) => {
      if (!isEditing) return;
      setFaculties((prev) => {
        const updated = [...prev];
        updated[index].photo = null;
        return updated;
      });
      setMediaPreview((prev) => {
        const updated = [...prev];
        updated[index] = null;
        return updated;
      });
    },
    [isEditing]
  );

  const handleAddFaculty = useCallback(() => {
    if (!isEditing) return;
    setFaculties((prev) => [...prev, { ...defaultFaculty }]);
    setMediaPreview((prev) => [...prev, null]);
  }, [isEditing]);

  const handleRemoveFaculty = useCallback(
    (index) => {
      if (!isEditing) return;
      setFaculties((prev) => {
        const updated = [...prev];
        updated.splice(index, 1);
        return updated;
      });
      setMediaPreview((prev) => {
        const updated = [...prev];
        updated.splice(index, 1);
        return updated;
      });
      if (expandedIndex === index) setExpandedIndex(null);
    },
    [isEditing, expandedIndex]
  );

  const handleEditClick = useCallback(() => {
    setIsEditing(true);
    setIsSubmitting(false);
    setErrors((prev) => ({ ...prev, submit: undefined }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validateForm() || isSubmitting) return;

      setIsSubmitting(true);
      try {
        const validFaculties = faculties
          .filter(
            (f) =>
              f.firstName.trim() &&
              f.lastName.trim() &&
              f.gender &&
              f.contact &&
              f.email &&
              f.subject &&
              f.experience >= 0 &&
              f.qualification
          )
          .map((faculty) => ({
            ...faculty,
            photo: null, // Remove photo field to avoid sending File object
          }));

        const formData = new FormData();

        // Append faculty data as JSON string
        formData.append("faculty", JSON.stringify(validFaculties));

        // Append each faculty's photo with the field name 'media'
        validFaculties.forEach((faculty, index) => {
          if (faculty.photo instanceof File) {
            formData.append("media", faculty.photo);
          }
        });

        const token = Cookies.get("authToken");
        const response = await axios.patch(
          `${VITE_BACKEND_BASE_URL}/api/institutes/me/faculties`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          localStorage.setItem(PROGRESS_KEY, "achievements");
          navigate("/institute/student-achievements");
        } else throw new Error("Server error");
      } catch (error) {
        console.error("Form submission failed:", error);
        setErrors({
          submit:
            error.response?.data?.message || "Submission failed. Try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [faculties, isSubmitting, navigate, validateForm, VITE_BACKEND_BASE_URL]
  );

  const renderRadioGroup = (index, field, label, options) => (
    <div className="mb-3">
      <h4 className="text-[#2D7A66] text-lg sm:text-xl font-semibold mb-1">
        {label}
      </h4>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-2 text-[#000] text-lg sm:text-xl font-medium"
          >
            <input
              type="radio"
              name={`${field}-${index}`}
              checked={faculties[index][field] === option}
              onChange={() => handleInputChange(index, field, option)}
              className="accent-[#2D7A66] size-5"
              disabled={!isEditing}
            />
            <span className="text-sm capitalize">
              {option.replace(/-/g, " ")}
            </span>
          </label>
        ))}
      </div>
      {errors[`faculty${index}`]?.[field] && (
        <p className="text-red-500 text-sm mt-1">
          {errors[`faculty${index}`][field]}
        </p>
      )}
    </div>
  );

  return (
    <div className="p-5 min-h-screen bg-[#E4EEE3]">
      <div className="relative">
        <button
          type="button"
          onClick={handleAddFaculty}
          className={`absolute top-[2.8rem] right-2 sm:right-5 text-white rounded-full px-6 py-3 flex items-center text-sm sm:text-base ${
            isEditing ? "bg-[#204B54]" : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!isEditing}
        >
          <FaPlus className="mr-2" /> ADD FACULTY
        </button>
      </div>

      <RegistrationNavigation />

      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        {faculties.map((faculty, index) => (
          <div
            key={index}
            className="bg-white border border-gray-300 rounded-xl p-4 shadow"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleExpand(index)}
            >
              <h3 className="text-xl sm:text-2xl font-semibold">
                Faculty {index + 1}
              </h3>
              <div className="flex items-center gap-3">
                {faculties.length > 1 && (
                  <FaTrash
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFaculty(index);
                    }}
                    className={`${
                      isEditing
                        ? "text-red-600 hover:text-red-800 cursor-pointer"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                  />
                )}
                {expandedIndex === index ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </div>

            {expandedIndex === index && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ["First Name", "firstName"],
                  ["Middle Name", "middleName"],
                  ["Last Name", "lastName"],
                  ["Subject", "subject"],
                  ["Qualification", "qualification"],
                  ["Salary (Optional)", "salary"],
                ].map(([label, field]) => (
                  <div key={field}>
                    <label className="block text-[#2D7A66] text-lg sm:text-xl font-medium mb-1">
                      {label}
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border text-base sm:text:lg font-normal rounded-md focus:ring-2 focus:ring-[#2D7A66]"
                      value={faculty[field]}
                      onChange={(e) =>
                        handleInputChange(index, field, e.target.value)
                      }
                      disabled={!isEditing}
                    />
                    {errors[`faculty${index}`]?.[field] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`faculty${index}`][field]}
                      </p>
                    )}
                  </div>
                ))}

                <div>
                  {renderRadioGroup(index, "gender", "Gender", [
                    "male",
                    "female",
                    "other",
                    "prefer-not-to-say",
                  ])}
                </div>

                {[
                  ["Contact", "contact"],
                  ["Email", "email"],
                  ["Experience (yrs)", "experience"],
                ].map(([label, field]) => (
                  <div key={field}>
                    <label className="block text-[#2D7A66] text-lg sm:text-xl font-medium mb-1">
                      {label}
                    </label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      className="w-full p-2 border text-base sm:text:lg font-normal rounded-md focus:ring-2 focus:ring-[#2D7A66]"
                      value={faculty[field]}
                      onChange={(e) =>
                        handleInputChange(index, field, e.target.value)
                      }
                      disabled={!isEditing}
                    />
                    {errors[`faculty${index}`]?.[field] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`faculty${index}`][field]}
                      </p>
                    )}
                  </div>
                ))}

                {/* ✅ Upload + Preview UI */}
                <div className="relative">
                  <label className="block text-[#2D7A66] text-lg sm:text-xl font-medium mb-1">
                    Photo (PNG/JPG)
                  </label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    ref={(el) => (fileInputRefs.current[index] = el)}
                    className="hidden"
                    onChange={(e) => handlePhotoChange(index, e)}
                    disabled={!isEditing}
                  />
                  <div
                    className="h-32 border border-gray-300 rounded cursor-pointer flex items-center justify-center"
                    onClick={() =>
                      isEditing &&
                      !mediaPreview[index] &&
                      fileInputRefs.current[index]?.click()
                    }
                  >
                    {mediaPreview[index] ? (
                      <img
                        src={mediaPreview[index]}
                        alt="Preview"
                        className="h-full object-cover"
                      />
                    ) : (
                      <FiUpload className="text-3xl text-gray-900" />
                    )}
                  </div>
                  {mediaPreview[index] && isEditing && (
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(index)}
                        className="text-sm text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                      >
                        Delete Photo
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[index]?.click()}
                        className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                      >
                        Upload New
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </form>

      <div className="flex justify-between items-center p-4 mt-4">
        <button
          type="button"
          onClick={() => navigate("/institute/courses")}
          className="flex items-center text-white bg-[#204B54] px-6 py-2 rounded-full"
        >
          <FaArrowLeft className="mr-2" /> Back
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
            type="submit"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className={`px-6 py-2 rounded-full text-white font-medium flex items-center ${
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

export default FacultiesPage;
