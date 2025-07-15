import { useState, useCallback, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import RegistrationNavigation from "../../components/Institute/RegistrationNavigation";
import axios from "axios";
import Cookies from "js-cookie";
import { AppContext } from "../../context/AppContext";

axios.defaults.withCredentials = true;

const facilitiesConfig = [
  {
    key: "library",
    label: "Library",
    description: "Physical and Digital resources",
  },
  {
    key: "mentorship",
    label: "Mentorship Programs",
    description: "One-on-One academic or career guidance",
  },
  {
    key: "tutorial",
    label: "Tutorial & Remedial Classes",
    description: "For extra career support",
  },
  {
    key: "hostel",
    label: "Hostel Accommodation",
    description: "Hostel or PG Assistance",
  },
  {
    key: "testSeries",
    label: "Test Series",
    description: "Regular tests for skill testing",
  },
  {
    key: "onlinePortal",
    label: "Online Learning Portal",
    description: "Mobile App/Portal Access",
  },
  {
    key: "studyMaterials",
    label: "Study Materials",
    description: "DPP & PDF Notes",
  },
  {
    key: "attendance",
    label: "Attendance Tracking",
    description: "Biometric or App-based tracking",
  },
  {
    key: "classes",
    label: "Well-equipped Classes",
    description: "AC, Smart Boards, Projectors etc.",
  },
  { key: "cctv", label: "CCTV Surveillance", description: "24x7 Monitoring" },
  {
    key: "medical",
    label: "Medical Facilities",
    description: "First aid & emergency care",
  },
];

const LOCAL_STORAGE_KEY = "instituteFacilitiesForm";

const FacilitiesPage = () => {
  const defaultFormData = facilitiesConfig.reduce(
    (acc, { key }) => ({ ...acc, [key]: null }),
    {
      other: "",
    }
  );

  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const { VITE_BACKEND_BASE_URL } = useContext(AppContext);
  const navigate = useNavigate();

  // Fetch saved data from backend or localStorage on mount
  useEffect(() => {
    const fetchFacilitiesData = async () => {
      console.log("Fetching facilities data from backend...");
      try {
        const response = await axios.get(
          `${VITE_BACKEND_BASE_URL}/api/institutes/profile`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("authToken")}`,
            },
          }
        );
        console.log("Backend response:", response.data);

        if (response.status === 200 && response.data.data?.facilities) {
          try {
            const savedData = JSON.parse(response.data.data.facilities);
            console.log("Parsed backend facilities data:", savedData);
            setFormData({
              ...defaultFormData,
              ...savedData,
              other: savedData.other || "",
            });

            setIsEditing(false);
          } catch (parseError) {
            console.error(
              "Failed to parse backend facilities data:",
              parseError
            );
            setErrors({ fetch: "Invalid facilities data format from backend" });
          }
        } else {
          console.log(
            "No facilities data in backend, checking localStorage..."
          );
          const savedFormData = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (savedFormData) {
            try {
              const parsed = JSON.parse(savedFormData);
              console.log("Parsed localStorage data:", parsed);
              setFormData({
                ...defaultFormData,
                ...parsed,
                other: parsed.other || "",
              });

              setIsEditing(true);
            } catch (e) {
              console.error("Invalid localStorage data:", e);
              setFormData(defaultFormData);
              setIsEditing(true);
            }
          } else {
            console.log("No localStorage data, using default form data");
            setFormData(defaultFormData);
            setIsEditing(true);
          }
        }
      } catch (err) {
        console.error("Failed to fetch facilities data from backend:", err);
        setErrors({
          fetch:
            err.response?.data?.message || "Failed to fetch facilities data",
        });
        const savedFormData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedFormData) {
          try {
            const parsed = JSON.parse(savedFormData);
            console.log("Parsed localStorage data (on fetch failure):", parsed);
            setFormData({
              ...defaultFormData,
              ...parsed,
              other: parsed.other || "",
            });

            setIsEditing(true);
          } catch (e) {
            console.error("Invalid localStorage data:", e);
            setFormData(defaultFormData);
            setIsEditing(true);
          }
        } else {
          console.log("No localStorage data, using default form data");
          setFormData(defaultFormData);
          setIsEditing(true);
        }
      }
    };

    fetchFacilitiesData();
  }, [VITE_BACKEND_BASE_URL]);

  // Save formData to localStorage only when editing
  useEffect(() => {
    if (isEditing) {
      console.log("Saving formData to localStorage:", {
        ...formData,
      });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...formData }));
    }
  }, [formData, isEditing]);

  const handleCheckboxChange = useCallback((key, value) => {
    console.log(`Checkbox changed: ${key} = ${value}`);
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    console.log(`Input changed: ${name} = ${value}`);
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    facilitiesConfig.forEach(({ key, label }) => {
      if (formData[key] === null) {
        newErrors[key] = `Please select Yes or No for ${label}`;
      }
    });

    console.log("Validation errors:", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleEditClick = useCallback(() => {
    console.log("Switching to edit mode");
    setIsEditing(true);
    setErrors((prev) => ({ ...prev, submit: undefined, fetch: undefined }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      console.log("Attempting form submission...", { isSubmitting, isEditing });
      if (!validateForm() || isSubmitting) {
        console.log("Form validation failed or already submitting");
        return;
      }

      setIsSubmitting(true);
      console.log("Submission started, isSubmitting set to true");

      try {
        console.log("Sending payload:", formData);
        const token = Cookies.get("authToken");
        const response = await axios.patch(
          `${VITE_BACKEND_BASE_URL}/api/institutes/me/facilities`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Backend submission response:", response.data);

        if (response.status === 200) {
          console.log("Submission successful, clearing localStorage");
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          setIsEditing(false);
          navigate("/institute/media");
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

  return (
    <div className="p-5 min-h-screen bg-[#E4EEE3]">
      <RegistrationNavigation />

      {errors.fetch && (
        <p className="text-red-500 text-sm text-center mb-4">{errors.fetch}</p>
      )}

      <form
        id="facilities-form"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-3xl shadow-lg border border-gray-300 mt-4"
        onSubmit={handleSubmit}
      >
        {facilitiesConfig.map(({ key, label, description }) => (
          <div
            key={key}
            className="border border-gray-300 p-4 rounded-xl bg-white"
          >
            <h4 className="text-lg font-semibold text-[#2D7A66]">{label}</h4>
            <p className="text-sm text-gray-700 mb-2">{description}</p>
            <div className="flex gap-4">
              {["Yes", "No"].map((option) => (
                <label key={option} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData[key] === option}
                    onChange={() => handleCheckboxChange(key, option)}
                    className={`accent-[#2D7A66] ${
                      isEditing ? "" : "opacity-50"
                    }`}
                    disabled={!isEditing}
                  />
                  {option}
                </label>
              ))}
            </div>
            {errors[key] && (
              <p className="text-red-500 text-xs mt-1">{errors[key]}</p>
            )}
          </div>
        ))}

        <div className="col-span-full border border-gray-300 p-4 rounded-xl bg-white">
          <h4 className="text-lg font-semibold text-[#2D7A66]">
            Other Facilities
          </h4>
          <textarea
            name="other"
            value={formData.other}
            onChange={handleInputChange}
            rows="3"
            placeholder="Mention any additional facility..."
            className={`w-full mt-2 border border-gray-300 rounded px-2 py-1 resize-none outline-none text-sm ${
              isEditing ? "bg-gray-200" : "bg-gray-50"
            }`}
            disabled={!isEditing}
          />
        </div>
      </form>

      <div className="flex justify-between items-center p-4 mt-4">
        <button
          type="button"
          onClick={() => navigate("/institute/institute-achievements")}
          className="flex items-center bg-[#204B54] text-white px-6 py-2 rounded-full"
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

export default FacilitiesPage;
