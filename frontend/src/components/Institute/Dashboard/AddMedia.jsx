import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Upload,
  ArrowLeft,
  Save,
} from "lucide-react";
import SidePanel from "./SidePanel";
import { assets } from "../../../assets/assets.js";
import Button from "../../ui/Button";
import InputField from "../../ui/InputField";
import Footer from "../../Footer.jsx";
import Navbar from "../../Navbar.jsx";

const AddMedia = () => {
  const navigate = useNavigate();
  const [media, setMedia] = useState({
    classroomImages: [{ title: "", description: "", file: null }],
    demoVideos: [{ title: "", description: "", file: null }],
    tourVideos: [{ title: "", description: "", file: null }],
  });
  const [mediaPreview, setMediaPreview] = useState({
    classroomImages: [],
    demoVideos: [],
    tourVideos: [],
  });
  const [errors, setErrors] = useState({});
  const [expandedIndices, setExpandedIndices] = useState({
    classroomImages: [0],
    demoVideos: [0],
    tourVideos: [0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState({});
  const fileInputRefs = useRef({
    classroomImages: [],
    demoVideos: [],
    tourVideos: [],
  });

  const mediaTypes = [
    {
      key: "classroomImages",
      title: "Classroom Images",
      accept: "image/png,image/jpeg",
      label: "Image (PNG/JPG)",
      maxSize: 5 * 1024 * 1024,
    },
    {
      key: "demoVideos",
      title: "Demo Videos",
      accept: "video/mp4",
      label: "Video (MP4)",
      maxSize: 50 * 1024 * 1024,
    },
    {
      key: "tourVideos",
      title: "Tour Videos",
      accept: "video/mp4",
      label: "Video (MP4)",
      maxSize: 50 * 1024 * 1024,
    },
  ];

  // Welcome back popup
  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedAddMedia");
    if (hasVisited) {
      toast(
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <h3 className="text-lg font-semibold text-[#144E53]">
              Welcome Back!
            </h3>
            <p className="text-sm text-gray-600">
              Add new media to showcase your institute.
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
    localStorage.setItem("hasVisitedAddMedia", "true");
  }, []);

  const handleInputChange = (type, index, field, value) => {
    setMedia((prev) => ({
      ...prev,
      [type]: prev[type].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
    setErrors((prev) => ({
      ...prev,
      [`${type}${index}`]: { ...prev[`${type}${index}`], [field]: "" },
    }));
  };

  const handleFileChange = (type, index, file) => {
    if (file) {
      const { accept, maxSize, label } = mediaTypes.find((t) => t.key === type);
      const validTypes = accept.split(",");
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          [`${type}${index}`]: {
            ...prev[`${type}${index}`],
            file: `Please upload a valid ${label}`,
          },
        }));
        return;
      }
      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          [`${type}${index}`]: {
            ...prev[`${type}${index}`],
            file: `File size exceeds ${maxSize / (1024 * 1024)}MB`,
          },
        }));
        return;
      }
      setMedia((prev) => ({
        ...prev,
        [type]: prev[type].map((item, i) =>
          i === index ? { ...item, file } : item
        ),
      }));
      setMediaPreview((prev) => ({
        ...prev,
        [type]: prev[type].map((url, i) =>
          i === index ? URL.createObjectURL(file) : url
        ),
      }));
      setErrors((prev) => ({
        ...prev,
        [`${type}${index}`]: { ...prev[`${type}${index}`], file: "" },
      }));
    }
  };

  const handleDrop = (type, index, e) => {
    e.preventDefault();
    setDragOver((prev) => ({ ...prev, [`${type}${index}`]: false }));
    const file = e.dataTransfer.files[0];
    handleFileChange(type, index, file);
  };

  const handleDragOver = (type, index, e) => {
    e.preventDefault();
    setDragOver((prev) => ({ ...prev, [`${type}${index}`]: true }));
  };

  const handleDragLeave = (type, index) => {
    setDragOver((prev) => ({ ...prev, [`${type}${index}`]: false }));
  };

  const handleDeleteFile = (type, index) => {
    setMedia((prev) => ({
      ...prev,
      [type]: prev[type].map((item, i) =>
        i === index ? { ...item, file: null } : item
      ),
    }));
    setMediaPreview((prev) => ({
      ...prev,
      [type]: prev[type].map((url, i) => (i === index ? null : url)),
    }));
    setErrors((prev) => ({
      ...prev,
      [`${type}${index}`]: { ...prev[`${type}${index}`], file: "" },
    }));
  };

  const handleAddItem = (type) => {
    setMedia((prev) => ({
      ...prev,
      [type]: [...prev[type], { title: "", description: "", file: null }],
    }));
    setMediaPreview((prev) => ({
      ...prev,
      [type]: [...prev[type], null],
    }));
    setExpandedIndices((prev) => ({
      ...prev,
      [type]: [...prev[type], prev[type].length],
    }));
    fileInputRefs.current[type].push(null);
  };

  const handleRemoveItem = (type, index) => {
    toast(
      <div className="flex flex-col gap-2">
        <p>
          Are you sure you want to remove this{" "}
          {type === "classroomImages" ? "image" : "video"}?
        </p>
        <div className="flex gap-2">
          <Button
            variant="danger"
            onClick={() => {
              setMedia((prev) => ({
                ...prev,
                [type]: prev[type].filter((_, i) => i !== index),
              }));
              setMediaPreview((prev) => ({
                ...prev,
                [type]: prev[type].filter((_, i) => i !== index),
              }));
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[`${type}${index}`];
                return newErrors;
              });
              setExpandedIndices((prev) => ({
                ...prev,
                [type]: prev[type]
                  .filter((i) => i !== index)
                  .map((i) => (i > index ? i - 1 : i)),
              }));
              fileInputRefs.current[type].splice(index, 1);
              toast.dismiss();
            }}
            className="text-xs sm:text-sm"
          >
            Confirm
          </Button>
          <Button
            variant="secondary"
            onClick={() => toast.dismiss()}
            className="text-xs sm:text-sm"
          >
            Cancel
          </Button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        style: {
          background: "#fff",
          color: "#144E53",
          padding: "16px",
          borderRadius: "8px",
        },
      }
    );
  };

  const toggleExpand = (type, index) => {
    setExpandedIndices((prev) => ({
      ...prev,
      [type]: prev[type].includes(index)
        ? prev[type].filter((i) => i !== index)
        : [...prev[type], index],
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let hasValidItem = false;
    mediaTypes.forEach(({ key, accept, maxSize, label }) => {
      media[key].forEach((item, index) => {
        const itemErrors = {};
        if (item.title.trim() || item.file) {
          if (!item.title.trim()) itemErrors.title = "Title is required";
          if (!item.file) itemErrors.file = `${label} is required`;
          if (item.file) {
            const validTypes = accept.split(",");
            if (!validTypes.includes(item.file.type)) {
              itemErrors.file = `Please upload a valid ${label}`;
            } else if (item.file.size > maxSize) {
              itemErrors.file = `File size exceeds ${
                maxSize / (1024 * 1024)
              }MB`;
            }
          }
          if (Object.keys(itemErrors).length > 0) {
            newErrors[`${key}${index}`] = itemErrors;
          } else {
            hasValidItem = true;
          }
        }
      });
    });
    if (!hasValidItem) {
      newErrors.form =
        "Please add at least one valid media item with title and file";
    }
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
      const newMediaItems = {
        classroomImages: [],
        demoVideos: [],
        tourVideos: [],
      };
      mediaTypes.forEach(({ key }) => {
        media[key].forEach((item, index) => {
          if (item.title.trim() && item.file) {
            newMediaItems[key].push({
              id: `${
                key === "classroomImages"
                  ? "image"
                  : key === "demoVideos"
                  ? "demo"
                  : "tour"
              }-${Date.now() + index}`,
              title: item.title,
              description: item.description,
              url: URL.createObjectURL(item.file),
            });
          }
        });
      });
      navigate("/institute/photos-and-videos", { state: { newMediaItems } });
      toast.success("Media added successfully!", {
        position: "top-right",
        duration: 3000,
        style: { background: "#E6EDE2", color: "#144E53", borderRadius: "8px" },
      });
    } catch (err) {
      toast.error("Failed to add media", {
        position: "top-right",
        duration: 3000,
        style: { background: "#E6EDE2", color: "#144E53", borderRadius: "8px" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Add Media
            </h1>
          </div>
          <form
            id="media-form"
            className="space-y-6 sm:space-y-8"
            onSubmit={handleSubmit}
          >
            {mediaTypes.map(({ key, title, accept, label }, index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-gradient-to-br from-white to-[#E6EDE2] bg-opacity-95 backdrop-blur-xl rounded-xl shadow-lg p-4 sm:p-6 border border-[#2D7A66]/10"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#144E53]">
                    {title}
                  </h2>
                  <Button
                    variant="primary"
                    onClick={() => handleAddItem(key)}
                    className="text-xs sm:text-sm"
                    aria-label={`Add New ${title}`}
                  >
                    <Plus className="w-4 h-4" /> Add {title}
                  </Button>
                </div>
                {media[key].length === 0 && (
                  <div className="text-center py-4 text-gray-700 text-sm sm:text-base">
                    No {title.toLowerCase()} added yet.
                  </div>
                )}
                {media[key].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-[#E6EDE2] bg-opacity-95 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 border border-[#2D7A66]/10 hover:shadow-lg transition-all duration-300"
                  >
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleExpand(key, index)}
                    >
                      <h3 className="text-base sm:text-lg font-semibold text-[#144E53] truncate">
                        {item.title || `${title} ${index + 1}`}
                      </h3>
                      <div className="flex items-center gap-3 sm:gap-4">
                        {media[key].length > 1 && (
                          <Trash2
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveItem(key, index);
                            }}
                            className="text-red-600 hover:text-red-800 cursor-pointer w-4 sm:w-5 h-4 sm:h-5"
                            aria-label={`Remove ${title} ${index + 1}`}
                          />
                        )}
                        {expandedIndices[key].includes(index) ? (
                          <ChevronUp className="text-[#2D7A66] w-4 sm:w-5 h-4 sm:h-5" />
                        ) : (
                          <ChevronDown className="text-[#2D7A66] w-4 sm:w-5 h-4 sm:h-5" />
                        )}
                      </div>
                    </div>
                    {expandedIndices[key].includes(index) && (
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <InputField
                            label="Title"
                            name="title"
                            value={item.title}
                            onChange={(e) =>
                              handleInputChange(
                                key,
                                index,
                                "title",
                                e.target.value
                              )
                            }
                            error={errors[`${key}${index}`]?.title}
                            required
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
                            value={item.description}
                            onChange={(e) =>
                              handleInputChange(
                                key,
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            className="w-full p-3 border border-[#2D7A66] rounded-md focus:outline-none focus:ring-2 focus:ring-[#93E9A2] transition-all bg-[#E6EDE2] text-sm sm:text-base"
                            rows="3"
                            whileFocus={{ scale: 1.02 }}
                            aria-label="Media Description"
                          />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                          className="sm:col-span-2"
                        >
                          <label className="block text-sm font-medium text-[#144E53] mb-1">
                            {label} <span className="text-red-500">*</span>
                          </label>
                          <motion.div
                            whileHover={{
                              scale: mediaPreview[key][index] ? 1 : 1.02,
                            }}
                            className={`h-40 sm:h-48 border border-[#2D7A66] rounded-md flex items-center justify-center cursor-pointer transition-all duration-200 ${
                              dragOver[`${key}${index}`]
                                ? "bg-[#93E9A2] border-dashed border-2"
                                : "bg-[#E6EDE2]"
                            }`}
                            onClick={() =>
                              !mediaPreview[key][index] &&
                              fileInputRefs.current[key][index]?.click()
                            }
                            onDrop={(e) => handleDrop(key, index, e)}
                            onDragOver={(e) => handleDragOver(key, index, e)}
                            onDragLeave={() => handleDragLeave(key, index)}
                          >
                            {mediaPreview[key][index] ? (
                              key === "classroomImages" ? (
                                <img
                                  src={mediaPreview[key][index]}
                                  alt="Preview"
                                  className="h-full w-full object-cover rounded-md"
                                  onError={(e) =>
                                    (e.target.src = assets.Not_found)
                                  }
                                />
                              ) : (
                                <video
                                  src={mediaPreview[key][index]}
                                  className="h-full w-full object-cover rounded-md"
                                  controls
                                  onError={(e) =>
                                    (e.target.poster = assets.Not_found)
                                  }
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
                            accept={accept}
                            ref={(el) =>
                              (fileInputRefs.current[key][index] = el)
                            }
                            className="hidden"
                            onChange={(e) =>
                              handleFileChange(key, index, e.target.files[0])
                            }
                            aria-label={`Upload ${label}`}
                          />
                          {mediaPreview[key][index] && (
                            <div className="flex gap-2 sm:gap-3 mt-2 sm:mt-3">
                              <Button
                                variant="danger"
                                onClick={() => handleDeleteFile(key, index)}
                                className="text-xs sm:text-sm"
                                aria-label={`Delete ${label}`}
                              >
                                Delete{" "}
                                {key === "classroomImages" ? "Image" : "Video"}
                              </Button>
                              <Button
                                variant="primary"
                                onClick={() =>
                                  fileInputRefs.current[key][index]?.click()
                                }
                                className="text-xs sm:text-sm"
                                aria-label={`Upload New ${label}`}
                              >
                                Upload New
                              </Button>
                            </div>
                          )}
                          {errors[`${key}${index}`]?.file && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors[`${key}${index}`].file}
                            </p>
                          )}
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            ))}
            {errors.form && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm text-center"
              >
                {errors.form}
              </motion.p>
            )}
            <div className="flex justify-between items-center gap-3 sm:gap-4">
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

export default AddMedia;
