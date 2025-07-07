import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import RegistrationNavigation from "../../components/Institute/RegistrationNavigation";
import { assets } from "../../assets/assets";

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

const FacilitiesPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(
    facilitiesConfig.reduce((acc, { key }) => ({ ...acc, [key]: null }), {
      other: "",
    })
  );
  const [errors, setErrors] = useState({});
  const [isDeclarationChecked, setIsDeclarationChecked] = useState(false);

  const handleCheckboxChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    facilitiesConfig.forEach(({ key, label }) => {
      if (formData[key] === null) {
        newErrors[key] = `Please select Yes or No for ${label}`;
      }
    });
    if (!isDeclarationChecked) {
      newErrors.declaration = "You must agree to the declaration";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch("https://api.example.com/facilities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) navigate("/media");
      else setErrors({ submit: "Failed to submit data. Please try again." });
    } catch {
      setErrors({ submit: "An error occurred. Please try again." });
    }
  };

  return (
    <div className="p-5 min-h-screen bg-[#E4EEE3]">
      {/* Navigation */}
      <RegistrationNavigation />

      {/* Form Section */}
      <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-3xl shadow-lg border border-black mt-4">
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
                    className="accent-[#2D7A66]"
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

        {/* Other Facilities */}
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
            className="w-full mt-2 border border-gray-300 rounded px-2 py-1 resize-none outline-none text-sm"
          />
        </div>
      </form>

      {/* Declaration & Navigation */}
      

        <div className="flex justify-between items-center p-4 mt-4">
          <button
            type="button"
            onClick={() => navigate("/institute/institute-achievements")}
            className="flex items-center bg-[#204B54] text-white px-6 py-2 rounded-full"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center bg-[#204B54] text-white px-6 py-2 rounded-full"
          >
            Save & Next
          </button>
        </div>
      

      {/* Submit error */}
      {errors.submit && (
        <p className="text-red-500 text-sm text-center mt-4">{errors.submit}</p>
      )}
    </div>
  );
};

export default FacilitiesPage;
