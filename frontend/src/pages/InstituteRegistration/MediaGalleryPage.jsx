import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaPlus, FaTrash } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import RegistrationNavigation from "../../components/Institute/RegistrationNavigation";
import { assets } from "../../assets/assets";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

const MediaGalleryPage = () => {
  const navigate = useNavigate();

  // Separate arrays for images and videos for each category
  const [classroomImages, setClassroomImages] = useState([]);
  const [demoVideos, setDemoVideos] = useState([]);
  const [tourVideos, setTourVideos] = useState([]);

  // Previews
  const [classroomPreviews, setClassroomPreviews] = useState([]);
  const [demoPreviews, setDemoPreviews] = useState([]);
  const [tourPreviews, setTourPreviews] = useState([]);

  // Errors
  const [errors, setErrors] = useState({});
  const [isDeclarationChecked, setIsDeclarationChecked] = useState(false);

  // Refs for hidden file inputs
  const classroomInputRef = useRef(null);
  const demoInputRef = useRef(null);
  const tourInputRef = useRef(null);

  // Validation helpers
  const validateFiles = (files, type) => {
    const newErrors = [];

    for (const file of files) {
      if (type === "image") {
        if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
          newErrors.push(`${file.name} is not a PNG/JPEG/JPG image.`);
        } else if (file.size > MAX_IMAGE_SIZE) {
          newErrors.push(`${file.name} exceeds 5MB size limit.`);
        }
      } else if (type === "video") {
        if (!["video/mp4", "video/webm"].includes(file.type)) {
          newErrors.push(`${file.name} is not an MP4/WebM video.`);
        } else if (file.size > MAX_VIDEO_SIZE) {
          newErrors.push(`${file.name} exceeds 100MB size limit.`);
        }
      }
    }
    return newErrors;
  };

  // Handle uploads
  const handleClassroomUpload = (e) => {
    const files = Array.from(e.target.files);
    const fileErrors = validateFiles(files, "image");
    if (fileErrors.length) {
      setErrors((prev) => ({ ...prev, classroom: fileErrors.join(" ") }));
      return;
    }
    setErrors((prev) => ({ ...prev, classroom: null }));

    setClassroomImages((prev) => [...prev, ...files]);
    setClassroomPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const handleDemoUpload = (e) => {
    const files = Array.from(e.target.files);
    const fileErrors = validateFiles(files, "video");
    if (fileErrors.length) {
      setErrors((prev) => ({ ...prev, demo: fileErrors.join(" ") }));
      return;
    }
    setErrors((prev) => ({ ...prev, demo: null }));

    setDemoVideos((prev) => [...prev, ...files]);
    setDemoPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const handleTourUpload = (e) => {
    const files = Array.from(e.target.files);
    const fileErrors = validateFiles(files, "video");
    if (fileErrors.length) {
      setErrors((prev) => ({ ...prev, tour: fileErrors.join(" ") }));
      return;
    }
    setErrors((prev) => ({ ...prev, tour: null }));

    setTourVideos((prev) => [...prev, ...files]);
    setTourPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };

  // Remove functions
  const removeClassroomImage = (index) => {
    setClassroomImages((prev) => prev.filter((_, i) => i !== index));
    setClassroomPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeDemoVideo = (index) => {
    setDemoVideos((prev) => prev.filter((_, i) => i !== index));
    setDemoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeTourVideo = (index) => {
    setTourVideos((prev) => prev.filter((_, i) => i !== index));
    setTourPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (classroomImages.length === 0) {
      newErrors.classroom = "At least one classroom image is required.";
    }
    if (demoVideos.length === 0) {
      newErrors.demo = "At least one demo video is required.";
    }

    if (!isDeclarationChecked) {
      newErrors.declaration = "You must agree to the declaration.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();

    classroomImages.forEach((file, i) => {
      formData.append(`classroomImages[${i}]`, file);
    });

    demoVideos.forEach((file, i) => {
      formData.append(`demoVideos[${i}]`, file);
    });

    tourVideos.forEach((file, i) => {
      formData.append(`tourVideos[${i}]`, file);
    });

    try {
      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        navigate("/social");
      } else {
        setErrors({ submit: "Upload failed. Please try again." });
      }
    } catch (error) {
      setErrors({ submit: "Network error. Please try again." });
    }
  };

  return (
    <div className="p-5 min-h-screen bg-[#E4EEE3]">
      <RegistrationNavigation />

      <form className="space-y-6 mt-6">
        {/* Classroom Images Section */}
        <div className="bg-white p-4 rounded-xl shadow mb-6 border border-black">
          <h3 className="font-semibold mb-3">Classroom Images</h3>
          <p className="text-sm text-gray-600 mb-2">
            PNG, JPG, JPEG &lt; 5MB each
          </p>
          <div className="flex flex-wrap gap-4">
            {classroomPreviews.map((src, idx) => (
              <div
                key={idx}
                className="relative w-32 h-24 rounded overflow-hidden border border-gray-300"
              >
                <img
                  src={src}
                  alt={`Classroom ${idx + 1}`}
                  className="object-cover w-full h-full cursor-pointer"
                  onClick={() => classroomInputRef.current.click()}
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  onClick={() => removeClassroomImage(idx)}
                  aria-label="Remove classroom image"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="w-32 h-24 flex flex-col items-center justify-center border border-dashed border-gray-400 rounded cursor-pointer text-gray-500 hover:bg-gray-100"
              onClick={() => classroomInputRef.current.click()}
              aria-label="Add classroom images"
            >
              <FiUpload className="text-3xl mb-1" />
              Add Images
            </button>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              multiple
              className="hidden"
              ref={classroomInputRef}
              onChange={handleClassroomUpload}
            />
          </div>
          {errors.classroom && (
            <p className="text-red-600 mt-2 text-sm">{errors.classroom}</p>
          )}
        </div>

        {/* Demo Videos Section */}
        <div className="bg-white p-4 rounded-xl shadow mb-6 border border-black">
          <h3 className="font-semibold mb-3">Demo Videos</h3>
          <p className="text-sm text-gray-600 mb-2">
            MP4, WebM &lt; 100MB each
          </p>
          <div className="flex flex-wrap gap-4">
            {demoPreviews.map((src, idx) => (
              <div
                key={idx}
                className="relative w-40 h-28 rounded overflow-hidden border border-gray-300"
              >
                <video
                  src={src}
                  controls
                  className="object-cover w-full h-full cursor-pointer"
                  onClick={() => demoInputRef.current.click()}
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  onClick={() => removeDemoVideo(idx)}
                  aria-label="Remove demo video"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="w-40 h-28 flex flex-col items-center justify-center border border-dashed border-gray-400 rounded cursor-pointer text-gray-500 hover:bg-gray-100"
              onClick={() => demoInputRef.current.click()}
              aria-label="Add demo videos"
            >
              <FiUpload className="text-3xl mb-1" />
              Add Videos
            </button>
            <input
              type="file"
              accept="video/mp4, video/webm"
              multiple
              className="hidden"
              ref={demoInputRef}
              onChange={handleDemoUpload}
            />
          </div>
          {errors.demo && (
            <p className="text-red-600 mt-2 text-sm">{errors.demo}</p>
          )}
        </div>

        {/* Tour Videos Section */}
        <div className="bg-white p-4 rounded-xl shadow mb-6 border border-black">
          <h3 className="font-semibold mb-3">Tour Videos (Optional)</h3>
          <p className="text-sm text-gray-600 mb-2">
            MP4, WebM &lt; 100MB each
          </p>
          <div className="flex flex-wrap gap-4">
            {tourPreviews.map((src, idx) => (
              <div
                key={idx}
                className="relative w-40 h-28 rounded overflow-hidden border border-gray-300"
              >
                <video
                  src={src}
                  controls
                  className="object-cover w-full h-full cursor-pointer"
                  onClick={() => tourInputRef.current.click()}
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  onClick={() => removeTourVideo(idx)}
                  aria-label="Remove tour video"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="w-40 h-28 flex flex-col items-center justify-center border border-dashed border-gray-400 rounded cursor-pointer text-gray-500 hover:bg-gray-100"
              onClick={() => tourInputRef.current.click()}
              aria-label="Add tour videos"
            >
              <FiUpload className="text-3xl mb-1" />
              Add Videos
            </button>
            <input
              type="file"
              accept="video/mp4, video/webm"
              multiple
              className="hidden"
              ref={tourInputRef}
              onChange={handleTourUpload}
            />
          </div>
          {errors.tour && (
            <p className="text-red-600 mt-2 text-sm">{errors.tour}</p>
          )}
        </div>

        {/* Declaration and Navigation */}

        <div className="flex justify-between items-center p-4 mt-4">
          <button
            type="button"
            onClick={() => navigate("/institute/facilities")}
            className="flex items-center text-white font-medium bg-[#204B54] px-6 py-2 rounded-full"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center px-6 py-2 rounded-full text-white font-medium bg-[#204B54]"
          >
            Save & Next
          </button>
        </div>

        {errors.submit && (
          <p className="text-red-600 text-center mt-2">{errors.submit}</p>
        )}
      </form>
    </div>
  );
};

export default MediaGalleryPage;
