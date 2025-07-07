import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaPlus,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import RegistrationNavigation from "../../components/Institute/RegistrationNavigation";
import { assets } from "../../assets/assets";

const initialSocialSet = {
  instagram: "",
  linkedin: "",
  facebook: "",
  other: "",
};
const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

const SocialMediaPage = () => {
  const [socialMediaSets, setSocialMediaSets] = useState([initialSocialSet]);
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [errors, setErrors] = useState({});
  const [isDeclarationChecked, setIsDeclarationChecked] = useState(false);
  const navigate = useNavigate();

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const validateSet = (set) => {
    const setErrors = {};
    const hasAnyField =
      set.instagram.trim() ||
      set.linkedin.trim() ||
      set.facebook.trim() ||
      set.other.trim();

    if (hasAnyField) {
      if (set.instagram.trim() && !URL_REGEX.test(set.instagram.trim()))
        setErrors.instagram = "Invalid Instagram URL";
      if (set.linkedin.trim() && !URL_REGEX.test(set.linkedin.trim()))
        setErrors.linkedin = "Invalid LinkedIn URL";
      if (set.facebook.trim() && !URL_REGEX.test(set.facebook.trim()))
        setErrors.facebook = "Invalid Facebook URL";
      if (set.other.trim() && !URL_REGEX.test(set.other.trim()))
        setErrors.other = "Invalid URL for other social media";
    }
    return { setErrors, hasAnyField };
  };

  const validateForm = () => {
    const newErrors = {};
    let hasValidSet = false;

    socialMediaSets.forEach((set, idx) => {
      const { setErrors, hasAnyField } = validateSet(set);

      if (hasAnyField && Object.keys(setErrors).length === 0) {
        hasValidSet = true;
      }
      if (Object.keys(setErrors).length > 0) {
        newErrors[`set${idx}`] = setErrors;
      }
    });

    if (!hasValidSet)
      newErrors.form = "At least one valid social media link is required.";
    if (!isDeclarationChecked)
      newErrors.declaration = "You must agree to the declaration.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (index, field, value) => {
    setSocialMediaSets((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    setErrors((prev) => {
      const copy = { ...prev };
      if (copy[`set${index}`]?.[field]) {
        delete copy[`set${index}`][field];
        if (Object.keys(copy[`set${index}`]).length === 0) {
          delete copy[`set${index}`];
        }
      }
      return copy;
    });
  };

  const addSocialMediaSet = () => {
    setSocialMediaSets((prev) => [...prev, initialSocialSet]);
    setExpandedIndex(socialMediaSets.length); // auto-expand new
  };

  const removeSocialMediaSet = (index) => {
    setSocialMediaSets((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
    // Adjust expandedIndex if needed
    if (expandedIndex === index) setExpandedIndex(null);
    else if (expandedIndex > index) setExpandedIndex(expandedIndex - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const validSets = socialMediaSets.filter((set) =>
      Object.values(set).some((val) => val.trim() !== "")
    );

    try {
      const response = await fetch("https://api.example.com/social-media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ socialMedia: validSets }),
      });

      if (response.ok) {
        navigate("/dashboard"); // Adjust route if needed
      } else {
        setErrors({ submit: "Failed to submit data. Please try again." });
      }
    } catch {
      setErrors({ submit: "An error occurred. Please try again." });
    }
  };

  return (
    <div className="p-5 min-h-screen bg-[#E4EEE3] ">
     <div className="relative">
               <button
               type="button"
               onClick={addSocialMediaSet}
               className="text-sm sm:text-base  absolute top-[2.8rem] right-2 sm:right-5 bg-[#204B54] text-white rounded-full flex justify-center items-center px-6 py-3"
             >
               <FaPlus className="mr-2" />ADD
             </button>
             </div>

      <RegistrationNavigation />

      <form onSubmit={handleSubmit} className="space-y-6 mt-6">
        {socialMediaSets.map((set, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-300 rounded-xl p-5 shadow"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleExpand(idx)}
            >
              <h3 className="text-lg font-semibold">Set {idx + 1}</h3>
              <div className="flex items-center gap-4">
                {socialMediaSets.length > 1 && (
                  <FaTrash
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSocialMediaSet(idx);
                    }}
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                    aria-label={`Remove social media set ${idx + 1}`}
                  />
                )}
                {expandedIndex === idx ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </div>

            {expandedIndex === idx && (
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { label: "Instagram Link (if any)", field: "instagram" },
                  { label: "LinkedIn Link (if any)", field: "linkedin" },
                  { label: "Facebook Link (if any)", field: "facebook" },
                  { label: "Other Social Media Link (if any)", field: "other" },
                ].map(({ label, field }) => (
                  <div key={field} className="flex flex-col">
                    <label
                      htmlFor={`${field}-${idx}`}
                      className="mb-1 font-medium text-gray-700"
                    >
                      {label}
                    </label>
                    <input
                      id={`${field}-${idx}`}
                      type="text"
                      value={set[field]}
                      onChange={(e) =>
                        handleInputChange(idx, field, e.target.value)
                      }
                      placeholder={`Enter ${label.toLowerCase()}`}
                      className={`border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#2D7A66] transition ${
                        errors[`set${idx}`]?.[field]
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      aria-invalid={!!errors[`set${idx}`]?.[field]}
                      aria-describedby={
                        errors[`set${idx}`]?.[field]
                          ? `${field}-error-${idx}`
                          : undefined
                      }
                    />
                    {errors[`set${idx}`]?.[field] && (
                      <p
                        id={`${field}-error-${idx}`}
                        className="mt-1 text-sm text-red-600"
                      >
                        {errors[`set${idx}`][field]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {errors.form && (
          <p className="text-center text-red-600 font-semibold">
            {errors.form}
          </p>
        )}

        {/* Declaration and navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <label className="flex items-center gap-3 text-base sm:text-lg font-medium text-gray-700">
            <input
              type="checkbox"
              checked={isDeclarationChecked}
              onChange={(e) => setIsDeclarationChecked(e.target.checked)}
              className="accent-[#2D7A66] w-5 h-5 cursor-pointer -mt-6 sm:mt-0"
              aria-describedby="declaration-error"
            />
            I declare all information provided by me is correct.
          </label>
          {errors.declaration && (
            <p
              id="declaration-error"
              className="text-red-600 font-semibold mt-2 sm:mt-0"
            >
              {errors.declaration}
            </p>
          )}

          <div className="flex gap-4 mt-4 sm:mt-0">
            <button
              type="button"
              onClick={() => navigate("/institute/media")}
              className="flex items-center text-white font-medium bg-[#204B54] px-6 py-2 rounded-full"
              aria-label="Go to Previous Page"
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-[#204B54] text-white px-6 py-2 rounded-full font-semibold"
              aria-label="Submit Social Media Links"
            >
              Complete Registration
            </button>
          </div>
        </div>

        {errors.submit && (
          <p className="text-center text-red-600 font-semibold mt-4">
            {errors.submit}
          </p>
        )}
      </form>
    </div>
  );
};

export default SocialMediaPage;
