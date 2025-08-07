import React, { useState, useCallback, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaPlus, FaTrash } from "react-icons/fa";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import RegistrationNavigation from "../../components/Institute/RegistrationNavigation";

// Set axios defaults to include credentials (cookies)
axios.defaults.withCredentials = true;

const URL_REGEX = /^(https?:\/\/)([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/i;

const LOCAL_STORAGE_KEY = "socialMediaForm";

const SocialMediaPage = () => {
  const navigate = useNavigate();
  const { VITE_BACKEND_BASE_URL } = useContext(AppContext);

  const [socialMedia, setSocialMedia] = useState({
    instagram: "",
    linkedin: "",
    facebook: "",
    twitter: "",
    youtube: "",
  });
  const [otherSocialMedia, setOtherSocialMedia] = useState([
    { label: "", link: "" },
  ]);
  const [errors, setErrors] = useState({});
  const [isDeclarationChecked, setIsDeclarationChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(true);

  // Fetch saved data from backend on mount
  useEffect(() => {
    let isMounted = true;
    const fetchSavedData = async () => {
      try {
        const response = await axios.get(
          `${VITE_BACKEND_BASE_URL}/api/institutes/profile`
        );
        console.log("Fetched profile data:", response.data);

        if (
          isMounted &&
          response.status === 200 &&
          response.data.data?.social_media
        ) {
          const parsedData = JSON.parse(response.data.data.social_media);
          console.log("fetched social media data", parsedData);

          const socialMediaData = parsedData.socialMedia || {};

          setSocialMedia({
            instagram: socialMediaData.instagram || "",
            linkedin: socialMediaData.linkedin || "",
            facebook: socialMediaData.facebook || "",
            twitter: socialMediaData.twitter || "",
            youtube: socialMediaData.youtube || "",
          });

          setOtherSocialMedia(
            socialMediaData.other && Array.isArray(socialMediaData.other)
              ? socialMediaData.other
              : [{ label: "", link: "" }]
          );

          setIsDeclarationChecked(true);
          setIsEditing(false);
        } else if (isMounted) {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          setSocialMedia({
            instagram: "",
            linkedin: "",
            facebook: "",
            twitter: "",
            youtube: "",
          });
          setOtherSocialMedia([{ label: "", link: "" }]);
          setIsDeclarationChecked(false);
          setIsEditing(true);
        }
      } catch (error) {
        console.error("Failed to fetch saved social media:", error);
        if (isMounted) {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          setSocialMedia({
            instagram: "",
            linkedin: "",
            facebook: "",
            twitter: "",
            youtube: "",
          });
          setOtherSocialMedia([{ label: "", link: "" }]);
          setIsDeclarationChecked(false);
          setIsEditing(true);
        }
      }
    };
    fetchSavedData();
    return () => {
      isMounted = false;
    };
  }, [VITE_BACKEND_BASE_URL]);

  // Save form data to localStorage when editing
  useEffect(() => {
    if (isEditing) {
      const formData = {
        socialMedia,
        otherSocialMedia,
        isDeclarationChecked,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
    }
  }, [socialMedia, otherSocialMedia, isDeclarationChecked, isEditing]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    const hasAnyField =
      Object.values(socialMedia).some((val) => val.trim()) ||
      otherSocialMedia.some((item) => item.label.trim() && item.link.trim());

    if (hasAnyField) {
      if (
        socialMedia.instagram.trim() &&
        !URL_REGEX.test(socialMedia.instagram.trim())
      )
        newErrors.instagram = "Invalid Instagram URL";
      if (
        socialMedia.linkedin.trim() &&
        !URL_REGEX.test(socialMedia.linkedin.trim())
      )
        newErrors.linkedin = "Invalid LinkedIn URL";
      if (
        socialMedia.facebook.trim() &&
        !URL_REGEX.test(socialMedia.facebook.trim())
      )
        newErrors.facebook = "Invalid Facebook URL";
      if (
        socialMedia.twitter.trim() &&
        !URL_REGEX.test(socialMedia.twitter.trim())
      )
        newErrors.twitter = "Invalid Twitter/X URL";
      if (
        socialMedia.youtube.trim() &&
        !URL_REGEX.test(socialMedia.youtube.trim())
      )
        newErrors.youtube = "Invalid YouTube URL";

      otherSocialMedia.forEach((item, idx) => {
        if (item.label.trim() && !item.link.trim()) {
          newErrors[`otherLink${idx}`] =
            "Link is required if platform name is provided";
        }
        if (item.link.trim() && !item.label.trim()) {
          newErrors[`otherLabel${idx}`] =
            "Platform name is required if link is provided";
        }
        if (
          item.link.trim() &&
          item.label.trim() &&
          !URL_REGEX.test(item.link.trim())
        ) {
          newErrors[`otherLink${idx}`] = "Invalid URL for other social media";
        }
      });
    } else {
      newErrors.form = "At least one valid social media link is required.";
    }

    if (!isDeclarationChecked) {
      newErrors.declaration = "You must agree to the declaration.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [socialMedia, otherSocialMedia, isDeclarationChecked]);

  const handleInputChange = (field, value) => {
    setSocialMedia((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const copy = { ...prev };
      if (copy[field]) delete copy[field];
      if (copy.form && Object.values(socialMedia).some((val) => val.trim())) {
        delete copy.form;
      }
      return copy;
    });
  };

  const handleOtherInputChange = (index, field, value) => {
    setOtherSocialMedia((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    setErrors((prev) => {
      const copy = { ...prev };
      if (copy[`otherLabel${index}`]) delete copy[`otherLabel${index}`];
      if (copy[`otherLink${index}`]) delete copy[`otherLink${index}`];
      if (
        copy.form &&
        (Object.values(socialMedia).some((val) => val.trim()) ||
          otherSocialMedia.some(
            (item) => item.label.trim() && item.link.trim()
          ))
      ) {
        delete copy.form;
      }
      return copy;
    });
  };

  const addOtherSocialMedia = () => {
    setOtherSocialMedia((prev) => [...prev, { label: "", link: "" }]);
  };

  const removeOtherSocialMedia = (index) => {
    setOtherSocialMedia((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[`otherLabel${index}`];
      delete copy[`otherLink${index}`];
      return copy;
    });
  };

  const handleEditClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validateForm() || isSubmitting) return;
      setIsSubmitting(true);

      const validSocialMedia = {};
      if (socialMedia.instagram.trim())
        validSocialMedia.instagram = socialMedia.instagram.trim();
      if (socialMedia.linkedin.trim())
        validSocialMedia.linkedin = socialMedia.linkedin.trim();
      if (socialMedia.facebook.trim())
        validSocialMedia.facebook = socialMedia.facebook.trim();
      if (socialMedia.twitter.trim())
        validSocialMedia.twitter = socialMedia.twitter.trim();
      if (socialMedia.youtube.trim())
        validSocialMedia.youtube = socialMedia.youtube.trim();
      const validOther = otherSocialMedia.filter(
        (item) => item.label.trim() && item.link.trim()
      );
      if (validOther.length > 0) validSocialMedia.other = validOther;

      try {
        const response = await axios.patch(
          `${VITE_BACKEND_BASE_URL}/api/institutes/me/social-media`,
          { socialMedia: validSocialMedia },
          { headers: { "Content-Type": "application/json" } }
        );

        //const data = await response.data;

        if (response.status === 200) {
          console.log("Social media submitted successfully:", response.data);
          localStorage.removeItem(LOCAL_STORAGE_KEY);

          navigate("/");
        }
      } catch (error) {
        console.error("Submission failed:", error);
        setErrors({
          submit:
            error.response?.data?.message ||
            "Failed to submit social media data",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      socialMedia,
      otherSocialMedia,
      isDeclarationChecked,
      validateForm,
      navigate,
      VITE_BACKEND_BASE_URL,
    ]
  );

  return (
    <div className="p-5 min-h-screen bg-[#E4EEE3]">
      <RegistrationNavigation />
      <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
        {/* Social Media Links Section */}
        <div className="bg-white p-4 rounded-xl shadow mb-6 border border-black">
          <h3 className="font-semibold mb-3">Social Media Links</h3>
          <p className="text-sm text-gray-600 mb-2">
            Enter valid URLs for your social media profiles (at least one
            required).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: "Instagram Link", field: "instagram" },
              { label: "LinkedIn Link", field: "linkedin" },
              { label: "Facebook Link", field: "facebook" },
              { label: "Twitter/X Link", field: "twitter" },
              { label: "YouTube Link", field: "youtube" },
            ].map(({ label, field }) => {
              const value = socialMedia[field].trim();
              const isValidUrl = value && URL_REGEX.test(value);
              const hasError = errors[field];

              return (
                <div key={field} className="flex flex-col">
                  <label
                    htmlFor={field}
                    className="mb-1 font-medium text-gray-700"
                  >
                    {label} (Optional)
                  </label>
                  <input
                    id={field}
                    type="text"
                    value={socialMedia[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    className={`border rounded-md px-3 py-2 outline-none focus:ring-2 transition ${
                      hasError
                        ? "border-red-500 focus:ring-red-500"
                        : isValidUrl
                        ? "border-blue-500 text-blue-600 focus:ring-blue-500"
                        : "border-gray-300 focus:ring-[#2D7A66]"
                    }`}
                    disabled={!isValidUrl && !isEditing}
                    aria-invalid={!!hasError}
                    aria-describedby={hasError ? `${field}-error` : undefined}
                  />
                  {hasError && (
                    <p
                      id={`${field}-error`}
                      className="mt-1 text-sm text-red-600"
                    >
                      {errors[field]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Other Social Media Section */}
        <div className="bg-white p-4 rounded-xl shadow mb-6 border border-black">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Other Social Media (Optional)</h3>
            {isEditing && (
              <button
                type="button"
                onClick={addOtherSocialMedia}
                className="flex items-center px-4 py-2 rounded-full text-white font-medium bg-[#204B54] hover:bg-[#2D7A66] transition"
                aria-label="Add another social media platform"
              >
                <FaPlus className="mr-2" />
                Add
              </button>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Provide a label and URL for additional social media platforms.
          </p>
          {otherSocialMedia.map((item, idx) => {
            const labelValue = item.label.trim();
            const linkValue = item.link.trim();
            const isValidLink = linkValue && URL_REGEX.test(linkValue);
            const labelError = errors[`otherLabel${idx}`];
            const linkError = errors[`otherLink${idx}`];

            return (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4"
              >
                {/* Platform Name */}
                <div className="flex flex-col">
                  <label
                    htmlFor={`otherLabel-${idx}`}
                    className="mb-1 font-medium text-gray-700"
                  >
                    Platform Name
                  </label>
                  <div className="relative">
                    <input
                      id={`otherLabel-${idx}`}
                      type="text"
                      value={item.label}
                      onChange={(e) =>
                        handleOtherInputChange(idx, "label", e.target.value)
                      }
                      placeholder="Enter platform name (e.g., TikTok)"
                      className={`border rounded-md px-3 py-2 outline-none focus:ring-2 transition ${
                        labelError
                          ? "border-red-500 focus:ring-red-500"
                          : labelValue
                          ? "border-gray-300  focus:ring-[#2D7A66]"
                          : "border-gray-300 focus:ring-[#2D7A66]"
                      }`}
                      disabled={!labelValue && !isEditing}
                      aria-invalid={!!labelError}
                      aria-describedby={
                        labelError ? `otherLabel-error-${idx}` : undefined
                      }
                    />
                    {isEditing && otherSocialMedia.length > 1 && (
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                        onClick={() => removeOtherSocialMedia(idx)}
                        aria-label="Remove social media platform"
                      >
                        <FaTrash size={12} />
                      </button>
                    )}
                  </div>
                  {labelError && (
                    <p
                      id={`otherLabel-error-${idx}`}
                      className="mt-1 text-sm text-red-600"
                    >
                      {labelError}
                    </p>
                  )}
                </div>

                {/* Platform Link */}
                <div className="flex flex-col">
                  <label
                    htmlFor={`otherLink-${idx}`}
                    className="mb-1 font-medium text-gray-700"
                  >
                    Platform Link
                  </label>
                  <input
                    id={`otherLink-${idx}`}
                    type="text"
                    value={item.link}
                    onChange={(e) =>
                      handleOtherInputChange(idx, "link", e.target.value)
                    }
                    placeholder="Enter platform URL"
                    className={`border rounded-md px-3 py-2 outline-none focus:ring-2 transition ${
                      linkError
                        ? "border-red-500 focus:ring-red-500"
                        : isValidLink
                        ? "border-blue-500 text-blue-500 focus:ring-blue-500"
                        : "border-gray-300 focus:ring-[#2D7A66]"
                    }`}
                    disabled={!isValidLink && !isEditing}
                    aria-invalid={!!linkError}
                    aria-describedby={
                      linkError ? `otherLink-error-${idx}` : undefined
                    }
                  />
                  {linkError && (
                    <p
                      id={`otherLink-error-${idx}`}
                      className="mt-1 text-sm text-red-600"
                    >
                      {linkError}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Declaration Checkbox */}
        <div className="bg-white p-4 rounded-xl shadow mb-6 border border-black">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isDeclarationChecked}
              onChange={(e) => setIsDeclarationChecked(e.target.checked)}
              className="mr-2 accent-[#2D7A66] w-5 h-5"
              disabled={!isEditing}
              aria-describedby="declaration-error"
            />
            <span>I declare all information provided by me is correct.</span>
          </label>
          {errors.declaration && (
            <p id="declaration-error" className="mt-2 text-sm text-red-600">
              {errors.declaration}
            </p>
          )}
        </div>

        {errors.submit && (
          <p className="text-red-600 text-center mt-2">{errors.submit}</p>
        )}
      </form>
      {/* Navigation */}
      <div className="flex justify-between items-center p-4 mt-4">
        <button
          type="button"
          onClick={() => navigate("/institute/media")}
          className="flex items-center px-6 py-2 rounded-full text-white font-medium bg-[#204B54] hover:bg-[#2D7A66] transition"
          aria-label="Go to Previous Page"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        {!isEditing ? (
          <button
            type="button"
            onClick={handleEditClick}
            className="flex items-center px-6 py-2 rounded-full text-white font-medium bg-[#204B54] hover:bg-[#2D7A66] transition"
            aria-label="Edit Social Media"
          >
            Edit
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className={`flex items-center px-6 py-2 rounded-full text-white font-medium transition ${
              isSubmitting
                ? "bg-[#2D7B67] cursor-not-allowed"
                : "bg-[#204B54] hover:bg-[#2D7B67]"
            }`}
            aria-label="Complete Registration"
          >
            {isSubmitting ? "Saving..." : "Complete Registration"}
            {!isSubmitting && <FaArrowRight className="ml-2" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default SocialMediaPage;
