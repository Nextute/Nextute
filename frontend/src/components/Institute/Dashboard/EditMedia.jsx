import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Upload, Trash2 } from "lucide-react";
import SidePanel from "./SidePanel";
import { useInstituteData } from "../../../hooks/useInstituteData.js";
import LoadingSpinner from "../../LoadingSpinner.jsx";
import { assets } from "../../../assets/assets.js";
import Button from "../../ui/Button";
import InputField from "../../ui/InputField";
import Navbar from "../../Navbar.jsx";
import Footer from "../../Footer.jsx";

const EditMedia = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { instituteDashboardData, dataLoading, hasRenderedOnce } =
    useInstituteData();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    file: null,
  });
  const [mediaPreview, setMediaPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const typeMap = {
    classroomImages: {
      key: "classroomImages",
      idPrefix: "image",
      accept: "image/png,image/jpeg",
      maxSize: 5 * 1024 * 1024,
      label: "Image (PNG/JPG)",
    },
    demoVideos: {
      key: "demoVideos",
      idPrefix: "demo",
      accept: "video/mp4",
      maxSize: 50 * 1024 * 1024,
      label: "Video (MP4)",
    },
    tourVideos: {
      key: "tourVideos",
      idPrefix: "tour",
      accept: "video/mp4",
      maxSize: 50 * 1024 * 1024,
      label: "Video (MP4)",
    },
  };

  // Welcome back popup
  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedEditMedia");
    if (hasVisited) {
      toast(
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <h3 className="text-lg font-semibold text-[#144E53]">
              Welcome Back!
            </h3>
            <p className="text-sm text-gray-600">
              Edit your media content with ease.
            </p>
          </div>
        </div>,
        {
          duration: 3000,
          position: "top-center",
          style: {
            background: "#E6EDE2",
            color: "#144E53",
            borderRadius: "12px",
            padding: "16px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          },
        }
      );
    }
    localStorage.setItem("hasVisitedEditMedia", "true");
  }, []);

  // Fetch media data
  useEffect(() => {
    if (!dataLoading && hasRenderedOnce) {
      try {
        if (location.state?.mediaItem && location.state?.mediaType === type) {
          const item = location.state.mediaItem;
          setFormData({
            title: item.title,
            description: item.description,
            url: item.url,
            file: null,
          });
          setMediaPreview(item.url);
        } else {
          const mediaGallery = instituteDashboardData?.media_gallery || {
            classroomImages: [],
            demoVideos: [],
            tourVideos: [],
          };
          const mediaType = typeMap[type]?.key;
          const idPrefix = typeMap[type]?.idPrefix;
          if (!mediaType || !idPrefix) throw new Error("Invalid media type");
          const mediaItems = Array.isArray(mediaGallery[mediaType])
            ? mediaGallery[mediaType].map((url, index) => ({
                id: `${idPrefix}-${index}`,
                title: `${
                  mediaType === "classroomImages"
                    ? "Classroom Image"
                    : mediaType === "demoVideos"
                    ? "Demo Video"
                    : "Tour Video"
                } ${index + 1}`,
                url,
                description: `${
                  mediaType === "classroomImages"
                    ? "Classroom image"
                    : mediaType === "demoVideos"
                    ? "Demo video"
                    : "Tour video"
                } ${index + 1}`,
              }))
            : [];
          const item = mediaItems.find((item) => item.id === id);
          if (item) {
            setFormData({
              title: item.title,
              description: item.description,
              url: item.url,
              file: null,
            });
            setMediaPreview(item.url);
          } else {
            throw new Error("Media item not found");
          }
        }
      } catch (err) {
        toast.error(err.message || "Error loading media item", {
          position: "top-right",
          duration: 3000,
          style: {
            background: "#E6EDE2",
            color: "#144E53",
            borderRadius: "8px",
          },
        });
        navigate("/institute/photos-and-videos");
      }
    }
  }, [
    instituteDashboardData,
    dataLoading,
    hasRenderedOnce,
    type,
    id,
    location.state,
    navigate,
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const { accept, maxSize, label } = typeMap[type];
      const validTypes = accept.split(",");
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          file: `Please upload a valid ${label}`,
        }));
        return;
      }
      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          file: `File size exceeds ${maxSize / (1024 * 1024)}MB`,
        }));
        return;
      }
      setFormData((prev) => ({ ...prev, file, url: "" }));
      setMediaPreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, file: "" }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const { accept, maxSize, label } = typeMap[type];
      const validTypes = accept.split(",");
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          file: `Please upload a valid ${label}`,
        }));
        return;
      }
      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          file: `File size exceeds ${maxSize / (1024 * 1024)}MB`,
        }));
        return;
      }
      setFormData((prev) => ({ ...prev, file, url: "" }));
      setMediaPreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, file: "" }));
    }
  };

  const handleDeleteFile = () => {
    setFormData((prev) => ({ ...prev, file: null, url: "" }));
    setMediaPreview(null);
    setErrors((prev) => ({ ...prev, file: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.url && !formData.file)
      newErrors.file = `${typeMap[type].label} is required`;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setErrors((prev) => ({
        ...prev,
        form: "Please fill all required fields correctly",
      }));
      return;
    }
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Media updated successfully!", {
        position: "top-right",
        duration: 3000,
        style: { background: "#E6EDE2", color: "#144E53", borderRadius: "8px" },
      });
      navigate("/institute/photos-and-videos");
    } catch (err) {
      toast.error("Failed to update media", {
        position: "top-right",
        duration: 3000,
        style: { background: "#E6EDE2", color: "#144E53", borderRadius: "8px" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (dataLoading || !hasRenderedOnce) return <LoadingSpinner />;

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-[#e5e7e4]">
        <SidePanel />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-4 sm:mb-6">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/institute/photos-and-videos")}
              className="p-2 bg-[#E6EDE2] rounded-full text-[#2D7A66] hover:bg-[#93E9A2] transition-all cursor-pointer"
              aria-label="Back to Media"
            >
              <ArrowLeft className="w-5 sm:w-6 h-5 sm:h-6" />
            </motion.div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#144E53] tracking-tight">
              Edit {typeMap[type]?.key.replace(/([A-Z])/g, " $1").trim()}
            </h1>
          </div>
          <form
            onSubmit={handleSubmit}
            className="bg-gradient-to-br from-white to-[#E6EDE2] bg-opacity-95 backdrop-blur-xl p-4 sm:p-6 rounded-xl shadow-lg border border-[#2D7A66]/10"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <InputField
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  error={errors.title}
                  required
                  placeholder="Enter media title"
                  className="w-full"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <label className="text-sm font-medium text-[#144E53] block mb-1">
                  Description
                </label>
                <motion.textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`w-full p-3 border border-[#2D7A66] rounded-md focus:outline-none focus:ring-2 focus:ring-[#93E9A2] transition-all bg-[#E6EDE2] text-sm sm:text-base ${
                    errors.description ? "border-red-500" : ""
                  }`}
                  rows="3"
                  whileFocus={{ scale: 1.02 }}
                  aria-label="Media Description"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="sm:col-span-2"
              >
                <label className="block text-sm font-medium text-[#144E53] mb-1">
                  {typeMap[type].label} <span className="text-red-500">*</span>
                </label>
                <motion.div
                  whileHover={{ scale: mediaPreview ? 1 : 1.02 }}
                  className={`h-40 sm:h-48 border border-[#2D7A66] rounded-md flex items-center justify-center cursor-pointer transition-all duration-200 ${
                    dragOver
                      ? "bg-[#93E9A2] border-dashed border-2"
                      : "bg-[#E6EDE2]"
                  }`}
                  onClick={() => !mediaPreview && fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                >
                  {mediaPreview ? (
                    type === "classroomImages" ? (
                      <img
                        src={mediaPreview}
                        alt="Preview"
                        className="h-full w-full object-cover rounded-md"
                        onError={(e) => (e.target.src = assets.Not_found)}
                      />
                    ) : (
                      <video
                        src={mediaPreview}
                        className="h-full w-full object-cover rounded-md"
                        controls
                        onError={(e) => (e.target.poster = assets.Not_found)}
                      />
                    )
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
                  accept={typeMap[type].accept}
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  aria-label={`Upload ${typeMap[type].label}`}
                />
                {mediaPreview && (
                  <div className="flex gap-2 sm:gap-3 mt-2 sm:mt-3">
                    <Button
                      variant="danger"
                      onClick={handleDeleteFile}
                      className="text-xs sm:text-sm"
                      aria-label="Delete Media"
                    >
                      Delete {type === "classroomImages" ? "Image" : "Video"}
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs sm:text-sm"
                      aria-label="Upload New Media"
                    >
                      Upload New
                    </Button>
                  </div>
                )}
                {errors.file && (
                  <p className="text-red-500 text-sm mt-1">{errors.file}</p>
                )}
              </motion.div>
            </div>
            {errors.form && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm text-center mt-4"
              >
                {errors.form}
              </motion.p>
            )}
            <div className="flex justify-between items-center mt-4 sm:mt-6 gap-3 sm:gap-4">
              <Button
                variant="secondary"
                onClick={() => navigate("/institute/photos-and-videos")}
                className="text-xs sm:text-sm"
                aria-label="Back to Media"
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
            </div>
          </form>
        </motion.div>
      </div>

      <Footer />
    </>
  );
};

export default EditMedia;
