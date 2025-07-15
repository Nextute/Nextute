import { useState, useRef, useCallback, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaPlus,
  FaTrash,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import RegistrationNavigation from "../../components/Institute/RegistrationNavigation";

// Set axios defaults to include credentials (cookies)
axios.defaults.withCredentials = true;

// Constants for validations
const VALIDATION_RULES = {
  instituteName: { required: true, message: "Institute name is required" },
  department: { required: true, message: "Department is required" },
  title: { required: true, message: "Achievement title is required" },
  description: { required: true, message: "Description is required" },
  type: { required: true, message: "Achievement type is required" },
  date: { required: true, message: "Achievement date is required" },
  level: { required: true, message: "Level is required" },
  award: { required: true, message: "Award received is required" },
};

const LOCAL_STORAGE_KEY = "instituteAchievementsForm";
const LOCAL_STORAGE_FILES_KEY = "instituteAchievementsFiles";

const defaultAchievement = {
  instituteName: "",
  department: "",
  title: "",
  description: "",
  type: "",
  date: "",
  level: "",
  award: "",
  documents: [],
};

const InstituteAchievementsPage = () => {
  const [achievements, setAchievements] = useState([{ ...defaultAchievement }]);
  const [filePreviews, setFilePreviews] = useState({});
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documentsUploading, setDocumentsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const fileInputRefs = useRef({});
  const { VITE_BACKEND_BASE_URL } = useContext(AppContext);
  const navigate = useNavigate();

  // Fetch saved data from backend on mount
  useEffect(() => {
    const fetchSavedData = async () => {
      try {
        const response = await axios.get(
          `${VITE_BACKEND_BASE_URL}/api/institutes/profile`
        );
        console.log("Fetched profile data:", response.data);

        if (
          response.status === 200 &&
          response.data.data?.institute_achievements
        ) {
          const parsedAchievements = JSON.parse(
            response.data.data.institute_achievements
          );
          const savedAchievements = parsedAchievements.achievements;
          setAchievements(
            savedAchievements.length
              ? savedAchievements
              : [{ ...defaultAchievement }]
          );
          setFilePreviews(
            savedAchievements.reduce(
              (acc, ach, idx) => ({
                ...acc,
                [idx]: ach.documents || [],
              }),
              {}
            )
          );
          setIsEditing(false); // Read-only mode for saved data
        } else {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          localStorage.removeItem(LOCAL_STORAGE_FILES_KEY);
          setAchievements([{ ...defaultAchievement }]);
          setFilePreviews({});
          setIsEditing(true);
        }
      } catch (error) {
        console.error("Failed to fetch saved achievements:", error);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        localStorage.removeItem(LOCAL_STORAGE_FILES_KEY);
        setAchievements([{ ...defaultAchievement }]);
        setFilePreviews({});
        setIsEditing(true);
      }
    };
    fetchSavedData();
  }, [VITE_BACKEND_BASE_URL]);

  // Save achievements to localStorage when editing
  useEffect(() => {
    if (isEditing) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(achievements));
    }
  }, [achievements, isEditing]);

  // Save file previews to localStorage
  useEffect(() => {
    if (isEditing) {
      localStorage.setItem(
        LOCAL_STORAGE_FILES_KEY,
        JSON.stringify(filePreviews)
      );
    }
  }, [filePreviews, isEditing]);

  // Validate form fields
  const validateForm = useCallback(() => {
    const newErrors = {};
    let hasValid = false;

    achievements.forEach((a, idx) => {
      const ae = {};
      const filled = Object.values(a).some(
        (val) => val?.trim?.() || (Array.isArray(val) && val.length)
      );
      if (filled) {
        Object.entries(VALIDATION_RULES).forEach(([key, rule]) => {
          const value = a[key];
          if (
            rule.required &&
            (!value || (Array.isArray(value) && !value.length))
          ) {
            ae[key] = rule.message;
          }
        });
      }
      if (!Object.keys(ae).length && a.title.trim()) hasValid = true;
      if (Object.keys(ae).length) newErrors[idx] = ae;
    });

    if (!hasValid)
      newErrors.form = "At least one complete achievement is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [achievements]);

  // Handle input changes
  const handleChange = useCallback((idx, field, value) => {
    setAchievements((prev) => {
      const updated = [...prev];
      updated[idx][field] = value;
      return updated;
    });
    setErrors((prev) => ({
      ...prev,
      [idx]: { ...prev[idx], [field]: undefined },
    }));
  }, []);

  // Handle file upload
  const handleFileChange = useCallback(
    async (idx, e) => {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      // Validate file types and size on frontend
      const allowedMimes = [
        "application/pdf",
        "image/png",
        "image/jpg",
        "image/jpeg",
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB
      for (const file of files) {
        if (!allowedMimes.includes(file.type)) {
          setErrors((prev) => ({
            ...prev,
            [idx]: {
              ...prev[idx],
              documents: "Only PDF, PNG, JPG, JPEG are allowed",
            },
          }));
          return;
        }
        if (file.size > maxSize) {
          setErrors((prev) => ({
            ...prev,
            [idx]: {
              ...prev[idx],
              documents: "File size must not exceed 10MB",
            },
          }));
          return;
        }
      }
      if (files.length > 5) {
        setErrors((prev) => ({
          ...prev,
          [idx]: { ...prev[idx], documents: "Maximum 5 files allowed" },
        }));
        return;
      }

      // Show local preview immediately
      const fileURLs = files.map((file) => URL.createObjectURL(file));
      setFilePreviews((prev) => ({ ...prev, [idx]: fileURLs }));

      setDocumentsUploading(true);
      try {
        const uploadFormData = new FormData();
        files.forEach((file) => uploadFormData.append("documents", file));

        const response = await axios.patch(
          `${VITE_BACKEND_BASE_URL}/api/institutes/upload/documents`,
          uploadFormData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (response.status === 200) {
          const uploadedUrls = response.data.urls || [];
          setAchievements((prev) =>
            prev.map((item, i) =>
              i === idx ? { ...item, documents: uploadedUrls } : item
            )
          );
          setFilePreviews((prev) => ({
            ...prev,
            [idx]: uploadedUrls,
          }));
        }
      } catch (error) {
        console.error("Document upload failed:", error);
        setErrors((prev) => ({
          ...prev,
          [idx]: {
            ...prev[idx],
            documents:
              error.response?.data?.message || "Failed to upload documents",
          },
        }));
      } finally {
        setDocumentsUploading(false);
      }
    },
    [VITE_BACKEND_BASE_URL]
  );

  // Handle file deletion
  const handleDeleteFile = useCallback((achIdx, fileIdx) => {
    setAchievements((prev) => {
      const updated = [...prev];
      updated[achIdx].documents = updated[achIdx].documents.filter(
        (_, i) => i !== fileIdx
      );
      return updated;
    });
    setFilePreviews((prev) => ({
      ...prev,
      [achIdx]: prev[achIdx].filter((_, i) => i !== fileIdx),
    }));
  }, []);

  // Add new achievement
  const addNew = useCallback(() => {
    setAchievements((prev) => [...prev, { ...defaultAchievement }]);
    setExpandedIndex(achievements.length);
  }, [achievements.length]);

  // Remove achievement
  const removeOne = useCallback(
    (idx) => {
      setAchievements((prev) => prev.filter((_, i) => i !== idx));
      setFilePreviews((prev) => {
        const updated = { ...prev };
        delete updated[idx];
        return updated;
      });
      if (expandedIndex === idx) setExpandedIndex(0);
    },
    [expandedIndex]
  );

  // Toggle expand
  const toggleExpand = useCallback(
    (idx) => {
      setExpandedIndex(expandedIndex === idx ? null : idx);
    },
    [expandedIndex]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validateForm() || isSubmitting || documentsUploading) return;
      setIsSubmitting(true);

      const validList = achievements.filter((a) => a.title.trim());
      console.log("📝 Submitting Payload:", validList);

      try {
        const response = await axios.patch(
          `${VITE_BACKEND_BASE_URL}/api/institutes/me/institute-achievements`,
          { achievements: validList },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.status === 200) {
          console.log("Achievements submitted successfully:", response.data);
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          localStorage.removeItem(LOCAL_STORAGE_FILES_KEY);
          navigate("/institute/facilities");
        }
      } catch (error) {
        console.error("Submission failed:", error);
        setErrors({
          submit:
            error.response?.data?.message || "Failed to submit achievements",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      achievements,
      isSubmitting,
      navigate,
      validateForm,
      documentsUploading,
      VITE_BACKEND_BASE_URL,
    ]
  );

  // Handle edit button click
  const handleEditClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  return (
    <div className="min-h-screen p-5 bg-[#E4EEE3]">
      <div className="relative">
        <button
          type="button"
          onClick={addNew}
          className={`text-sm sm:text-base absolute top-[2.8rem] right-2 sm:right-5 text-white rounded-full flex justify-center items-center px-6 py-3 ${
            isEditing
              ? "bg-[#204B54] hover:bg-[#2D7B67]"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!isEditing}
        >
          <FaPlus className="mr-2" />
          Add Achievement
        </button>
      </div>
      <RegistrationNavigation />
      <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
        {achievements.map((a, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-300 rounded-xl shadow-md"
          >
            <div
              onClick={() => toggleExpand(idx)}
              className="p-4 flex justify-between items-center cursor-pointer"
            >
              <h3 className="text-lg font-semibold">Achievement {idx + 1}</h3>
              <div className="flex items-center gap-3">
                {isEditing && achievements.length > 1 && (
                  <FaTrash
                    onClick={(e) => {
                      e.stopPropagation();
                      removeOne(idx);
                    }}
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                  />
                )}
                {expandedIndex === idx ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </div>
            {expandedIndex === idx && (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ["Institute Name", "instituteName"],
                  ["Department", "department"],
                  ["Achievement Title", "title"],
                  ["Achievement Type", "type"],
                  ["Level", "level"],
                  ["Award Received", "award"],
                ].map(([label, field]) => (
                  <div
                    key={field}
                    className="bg-white border border-gray-300 rounded-xl p-4"
                  >
                    <label className="block font-medium text-gray-800 text-lg">
                      {label}
                    </label>
                    <input
                      type="text"
                      className={`mt-1 w-full text-gray-900 ${
                        isEditing ? "bg-gray-200" : "bg-gray-50"
                      } rounded-xl p-2 focus:ring-2 focus:ring-[#2D7A66] border-none outline-none`}
                      value={a[field]}
                      onChange={(e) => handleChange(idx, field, e.target.value)}
                      disabled={!isEditing}
                      aria-invalid={!!errors[idx]?.[field]}
                    />
                    {errors[idx]?.[field] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[idx][field]}
                      </p>
                    )}
                  </div>
                ))}
                <div className="bg-white border border-gray-300 rounded-xl p-4">
                  <label className="block font-medium text-gray-800 text-lg">
                    Achievement Date
                  </label>
                  <input
                    type="date"
                    className={`mt-1 w-full text-gray-900 ${
                      isEditing ? "bg-gray-200" : "bg-gray-50"
                    } rounded-xl p-2 focus:ring-2 focus:ring-[#2D7A66] border-none outline-none`}
                    value={a.date}
                    onChange={(e) => handleChange(idx, "date", e.target.value)}
                    disabled={!isEditing}
                    aria-invalid={!!errors[idx]?.date}
                  />
                  {errors[idx]?.date && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[idx].date}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2 bg-white border border-gray-300 rounded-xl p-4">
                  <label className="block font-medium text-gray-800 text-lg">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className={`mt-1 w-full text-gray-900 ${
                      isEditing ? "bg-gray-200" : "bg-gray-50"
                    } rounded-xl p-2 focus:ring-2 focus:ring-[#2D7A66] border-none outline-none resize-none`}
                    value={a.description}
                    onChange={(e) =>
                      handleChange(idx, "description", e.target.value)
                    }
                    disabled={!isEditing}
                    aria-invalid={!!errors[idx]?.description}
                  />
                  {errors[idx]?.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[idx].description}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2 bg-white border border-gray-300 rounded-xl p-4">
                  <label className="block font-medium text-gray-800 text-lg">
                    Supporting Documents{" "}
                    <span className="text-gray-500">(Image/PDF)</span>
                  </label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,application/pdf"
                    multiple
                    className="mt-1 w-full border border-gray-300 rounded p-2 hidden"
                    ref={(el) => (fileInputRefs.current[idx] = el)}
                    onChange={(e) => handleFileChange(idx, e)}
                    disabled={!isEditing}
                  />
                  {isEditing && (
                    <div
                      className="flex justify-center items-center w-60 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-500"
                      onClick={() =>
                        !documentsUploading &&
                        fileInputRefs.current[idx]?.click()
                      }
                    >
                      {documentsUploading ? (
                        <div className="flex flex-col items-center justify-center space-y-2">
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
                          <span className="text-[#2D7A66] font-medium text-sm">
                            Uploading...
                          </span>
                        </div>
                      ) : (
                        <FaPlus className="text-4xl text-gray-600" />
                      )}
                    </div>
                  )}
                  <div className="mt-2 flex flex-wrap gap-3">
                    {filePreviews[idx]?.map((doc, docIdx) => (
                      <div key={docIdx} className="relative">
                        {doc.endsWith(".pdf") ? (
                          <div className="w-24 h-24 flex items-center justify-center bg-gray-100 border rounded">
                            <span className="text-sm text-gray-700">PDF</span>
                          </div>
                        ) : (
                          <img
                            src={doc}
                            alt={`document-${docIdx}`}
                            className="w-24 h-24 object-cover rounded border"
                          />
                        )}
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => handleDeleteFile(idx, docIdx)}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                          >
                            <FaTrash size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {errors[idx]?.documents && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors[idx].documents}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        {errors.form && (
          <p className="text-red-500 text-center">{errors.form}</p>
        )}

        {errors.submit && (
          <p className="text-red-500 text-sm text-center mt-2">
            {errors.submit}
          </p>
        )}
      </form>
      <div className="flex items-center justify-between p-4 mt-4">
        <button
          type="button"
          onClick={() => navigate("/institute/student-achievements")}
          className="flex items-center px-6 py-2 rounded-full text-white font-medium bg-[#204B54] hover:bg-[#2D7B67] transition"
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
            type="submit"
            disabled={isSubmitting || documentsUploading}
            onClick={handleSubmit}
            className={`flex items-center px-6 py-2 rounded-full text-white font-medium transition ${
              isSubmitting || documentsUploading
                ? "bg-[#2D7B67] cursor-not-allowed"
                : "bg-[#204B54]"
            }`}
          >
            {isSubmitting ? "Saving..." : "Save & Next"}
            {!isSubmitting && !documentsUploading && (
              <FaArrowRight className="ml-2" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default InstituteAchievementsPage;
