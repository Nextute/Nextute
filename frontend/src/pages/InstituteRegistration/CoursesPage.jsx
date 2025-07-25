import React, { useState, useCallback, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
} from "react-icons/fa";
import RegistrationNavigation from "../../components/Institute/RegistrationNavigation";
import axios from "axios";
import Cookies from "js-cookie";
import { AppContext } from "../../context/AppContext";

axios.defaults.withCredentials = true;

const defaultCourse = { details: "", category: "", feeRange: "", medium: "" };
const LOCAL_STORAGE_KEY = "instituteCoursesForm";

const CoursesPage = () => {
  const [courses, setCourses] = useState([{ ...defaultCourse }]);
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const { VITE_BACKEND_BASE_URL } = useContext(AppContext);
  const navigate = useNavigate();

  // Fetch saved data from backend or localStorage on mount
  useEffect(() => {
    const fetchCoursesData = async () => {
      console.log("Fetching courses data from backend...");
      try {
        const response = await axios.get(
          `${VITE_BACKEND_BASE_URL}/api/institutes/profile`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("authToken")}`,
            },
          }
        );
        console.log("Backend response :", response.data);
        console.log("Backend courses data:", response.data.data?.courses);
        

        if (response.status === 200 && response.data.data?.courses) {
          try {
            const parsed = JSON.parse(response.data.data.courses);
            console.log("Parsed backend courses data:", parsed);

            const courseArray = Array.isArray(parsed)
              ? parsed
              : Array.isArray(parsed.courses)
              ? parsed.courses
              : [];

            setCourses(
              courseArray.length > 0 ? courseArray : [{ ...defaultCourse }]
            );
            setIsEditing(false);
          } catch (parseError) {
            console.error("Failed to parse backend courses data:", parseError);
            setErrors({ fetch: "Invalid courses data format from backend" });
          }
        } else {
          console.log("No courses data in backend, checking localStorage...");
          const savedCourses = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (savedCourses) {
            try {
              const parsed = JSON.parse(savedCourses);
              console.log("Parsed localStorage data:", parsed);
              setCourses(parsed.length > 0 ? parsed : [{ ...defaultCourse }]);
              setIsEditing(true);
            } catch (e) {
              console.error("Invalid localStorage data:", e);
              setCourses([{ ...defaultCourse }]);
              setIsEditing(true);
            }
          } else {
            console.log("No localStorage data, using default course data");
            setCourses([{ ...defaultCourse }]);
            setIsEditing(true);
          }
        }
      } catch (err) {
        console.error("Failed to fetch courses data from backend:", err);
        setErrors({
          fetch: err.response?.data?.message || "Failed to fetch courses data",
        });
        const savedCourses = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedCourses) {
          try {
            const parsed = JSON.parse(savedCourses);

            setCourses(parsed.length > 0 ? parsed : [{ ...defaultCourse }]);
            setIsEditing(true);
          } catch (e) {
            console.error("Invalid localStorage data:", e);
            setCourses([{ ...defaultCourse }]);
            setIsEditing(true);
          }
        } else {
          console.log("No localStorage data, using default course data");
          setCourses([{ ...defaultCourse }]);
          setIsEditing(true);
        }
      }
    };

    fetchCoursesData();
  }, [VITE_BACKEND_BASE_URL]);

  // Save courses to localStorage only when editing
  useEffect(() => {
    if (isEditing) {
      console.log("Saving courses to localStorage:", courses);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(courses));
    }
  }, [courses, isEditing]);

  const toggleExpand = useCallback((index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    let hasValidCourse = false;

    courses.forEach((course, index) => {
      const courseErrors = {};

      if (
        course.details.trim() ||
        course.category ||
        course.feeRange ||
        course.medium
      ) {
        if (!course.details.trim())
          courseErrors.details = "Course details are required";
        if (!course.category) courseErrors.category = "Select a category";
        if (!course.feeRange) courseErrors.feeRange = "Select a fee range";
        if (!course.medium) courseErrors.medium = "Select a medium";
      }

      if (Object.keys(courseErrors).length === 0 && course.details.trim()) {
        hasValidCourse = true;
      }

      if (Object.keys(courseErrors).length > 0) {
        newErrors[`course${index}`] = courseErrors;
      }
    });

    if (!hasValidCourse) {
      newErrors.form = "At least one course must be fully filled";
    }

    console.log("hasValidCourse:", hasValidCourse);
    console.log("Validation errors:", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [courses]);

  const handleInputChange = useCallback((index, field, value) => {
    console.log(`Input changed: course[${index}].${field} = ${value}`);
    setCourses((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    setErrors((prev) => ({
      ...prev,
      [`course${index}`]: { ...prev[`course${index}`], [field]: undefined },
    }));
  }, []);

  const handleAddCourse = useCallback(() => {
    if (!isEditing) return;

    setCourses((prev) => [...prev, { ...defaultCourse }]);
    setExpandedIndex(courses.length);
  }, [isEditing, courses.length]);

  const handleRemoveCourse = useCallback(
    (index) => {
      if (!isEditing) return;

      const updated = [...courses];
      updated.splice(index, 1);
      setCourses(updated);
      if (expandedIndex === index) setExpandedIndex(null);
    },
    [isEditing, courses, expandedIndex]
  );

  const handleEditClick = useCallback(() => {
    setIsEditing(true);
    setErrors((prev) => ({ ...prev, submit: undefined, fetch: undefined }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateForm() || isSubmitting) {
        console.log("Form validation failed or already submitting");
        return;
      }

      setIsSubmitting(true);

      try {
        const validCourses = courses.filter(
          (c) => c.details.trim() && c.category && c.feeRange && c.medium
        );

        // Ensure validCourses is an array
        if (!Array.isArray(validCourses)) {
          throw new Error("Courses data is not an array");
        }

        // Prevent submission if no valid courses
        if (validCourses.length === 0) {
          setErrors({ form: "At least one valid course is required" });
          setIsSubmitting(false);
          return;
        }

        const token = Cookies.get("authToken");
        const response = await axios.patch(
          `${VITE_BACKEND_BASE_URL}/api/institutes/me/courses`,
          { courses: validCourses },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Backend submission response:", response.data);

        if (response.status === 200) {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          setIsEditing(false);
          navigate("/institute/faculties");
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
    [courses, isSubmitting, navigate, validateForm, VITE_BACKEND_BASE_URL]
  );

  const renderRadioGroup = (index, field, label, options) => (
    <div className="mb-3">
      <h4 className="text-xl font-semibold mb-1">{label}</h4>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2">
            <input
              type="radio"
              name={`${field}-${index}`}
              checked={courses[index][field] === option}
              onChange={() => handleInputChange(index, field, option)}
              className={`accent-[#2D7A66] size-4 ${
                isEditing ? "" : "opacity-50"
              }`}
              disabled={!isEditing}
            />
            <span className="text-lg capitalize">{option}</span>
          </label>
        ))}
      </div>
      {errors[`course${index}`]?.[field] && (
        <p className="text-red-500 text-sm mt-1">
          {errors[`course${index}`][field]}
        </p>
      )}
    </div>
  );

  return (
    <div className="p-5 min-h-screen bg-[#E4EEE3]">
      <div className="relative">
        <button
          type="button"
          onClick={handleAddCourse}
          className={`text-sm sm:text-base absolute top-[2.8rem] right-2 sm:right-5 text-white rounded-full flex justify-center items-center px-6 py-3 ${
            isEditing
              ? "bg-[#204B54] hover:bg-[#2D7B67]"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!isEditing}
        >
          <FaPlus className="mr-2" /> ADD COURSE
        </button>
      </div>

      <RegistrationNavigation />

      {errors.fetch && (
        <p className="text-red-500 text-sm text-center mb-4">{errors.fetch}</p>
      )}

      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        {courses.map((course, index) => (
          <div
            key={index}
            className="bg-white border border-gray-300 rounded-xl p-4 shadow"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleExpand(index)}
            >
              <h3 className="text-2xl font-semibold">Course {index + 1}</h3>
              <div className="flex items-center gap-3">
                {courses.length > 1 && (
                  <FaTrash
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveCourse(index);
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
                <div>
                  <label className="block text-xl font-medium mb-1">
                    Course Details
                  </label>
                  <textarea
                    className={`w-full text-base p-2 border rounded-md outline-none focus:ring-2 focus:ring-[#2D7A66] resize-none ${
                      isEditing ? "bg-gray-200" : "bg-gray-50"
                    }`}
                    rows={4}
                    placeholder="What you offer in this course?"
                    value={course.details}
                    onChange={(e) =>
                      handleInputChange(index, "details", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                  {errors[`course${index}`]?.details && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[`course${index}`].details}
                    </p>
                  )}
                </div>

                <div>
                  {renderRadioGroup(index, "category", "Course Category", [
                    "regular",
                    "crash",
                    "dropper",
                    "foundation",
                  ])}
                </div>
                <div>
                  {renderRadioGroup(index, "feeRange", "Fee Range", [
                    "500-1k",
                    "1k-2k",
                    "2k-5k",
                    "5k-15k",
                  ])}
                </div>
                <div>
                  {renderRadioGroup(index, "medium", "Medium", [
                    "hindi",
                    "english",
                    "hinglish",
                  ])}
                </div>
              </div>
            )}
          </div>
        ))}

        {errors.form && (
          <p className="text-red-500 text-sm text-center">{errors.form}</p>
        )}
      </form>

      <div className="flex justify-between items-center p-4 mt-4">
        <button
          type="button"
          onClick={() => navigate("/institute/contact")}
          className="flex items-center text-white font-medium bg-[#204B54] px-6 py-2 rounded-full"
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

export default CoursesPage;
