import { useState, useRef, useCallback, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaPlus, FaTrash } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import RegistrationNavigation from "../../components/Institute/RegistrationNavigation";

axios.defaults.withCredentials = true;

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

const LOCAL_STORAGE_KEY = "mediaGalleryForm";
const LOCAL_STORAGE_PREVIEWS_KEY = "mediaGalleryPreviews";

const MediaGalleryPage = () => {
  const navigate = useNavigate();
  const { VITE_BACKEND_BASE_URL } = useContext(AppContext);

  const [classroomImages, setClassroomImages] = useState([]);
  const [demoVideos, setDemoVideos] = useState([]);
  const [tourVideos, setTourVideos] = useState([]);
  const [classroomPreviews, setClassroomPreviews] = useState([]);
  const [demoPreviews, setDemoPreviews] = useState([]);
  const [tourPreviews, setTourPreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImgUploading, setIsImgUploading] = useState(false);
  const [isDemoUploading, setIsDemoUploading] = useState(false);
  const [isTourUploading, setIsTourUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(true);

  const classroomInputRef = useRef(null);
  const demoInputRef = useRef(null);
  const tourInputRef = useRef(null);

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
          response.data.data?.media_gallery
        ) {
          const parsedMedia = JSON.parse(response.data.data.media_gallery);
          setClassroomImages(parsedMedia.classroomImages || []);
          setDemoVideos(parsedMedia.demoVideos || []);
          setTourVideos(parsedMedia.tourVideos || []);
          setClassroomPreviews(parsedMedia.classroomImages || []);
          setDemoPreviews(parsedMedia.demoVideos || []);
          setTourPreviews(parsedMedia.tourVideos || []);

          setIsEditing(false);
        } else if (isMounted) {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          localStorage.removeItem(LOCAL_STORAGE_PREVIEWS_KEY);
          setClassroomImages([]);
          setDemoVideos([]);
          setTourVideos([]);
          setClassroomPreviews([]);
          setDemoPreviews([]);
          setTourPreviews([]);
          setIsEditing(true);
        }
      } catch (error) {
        console.error("Failed to fetch saved media:", error);
        if (isMounted) {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          localStorage.removeItem(LOCAL_STORAGE_PREVIEWS_KEY);
          setClassroomImages([]);
          setDemoVideos([]);
          setTourVideos([]);
          setClassroomPreviews([]);
          setDemoPreviews([]);
          setTourPreviews([]);
          setIsEditing(true);
        }
      }
    };
    fetchSavedData();
    return () => {
      isMounted = false;
    };
  }, [VITE_BACKEND_BASE_URL]);

  useEffect(() => {
    if (isEditing) {
      const formData = {
        classroomImages,
        demoVideos,
        tourVideos,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
    }
  }, [classroomImages, demoVideos, tourVideos, isEditing]);

  useEffect(() => {
    if (isEditing) {
      const previews = {
        classroomPreviews,
        demoPreviews,
        tourPreviews,
      };
      localStorage.setItem(
        LOCAL_STORAGE_PREVIEWS_KEY,
        JSON.stringify(previews)
      );
    }
  }, [classroomPreviews, demoPreviews, tourPreviews, isEditing]);

  const validateFiles = useCallback((files, type) => {
    const allowedMimes =
      type === "image"
        ? ["image/png", "image/jpeg", "image/jpg"]
        : ["video/mp4", "video/webm"];
    const maxSize = type === "image" ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
    const maxSizeLabel = type === "image" ? "5MB" : "100MB";
    const typeLabel = type === "image" ? "PNG/JPEG/JPG" : "MP4/WebM";

    const errors = [];
    for (const file of files) {
      if (!allowedMimes.includes(file.type)) {
        errors.push(`${file.name} is not a ${typeLabel} file.`);
      } else if (file.size > maxSize) {
        errors.push(`${file.name} exceeds ${maxSizeLabel} size limit.`);
      }
    }
    return errors;
  }, []);

  const handleClassroomUpload = useCallback(
    async (e) => {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      const fileErrors = validateFiles(files, "image");
      if (fileErrors.length) {
        setErrors((prev) => ({ ...prev, classroom: fileErrors.join(" ") }));
        return;
      }
      setErrors((prev) => ({ ...prev, classroom: null }));

      const fileURLs = files.map((file) => URL.createObjectURL(file));
      setClassroomPreviews((prev) => [...prev, ...fileURLs]);
      setIsImgUploading(true);

      try {
        const formData = new FormData();
        files.forEach((file) => formData.append("image", file));

        const response = await axios.patch(
          `${VITE_BACKEND_BASE_URL}/api/institutes/upload/image`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        console.log("Classroom upload response:", response.data);
        if (response.status === 200) {
          // Handle both single url and urls array
          let uploadedUrls = [];
          if (response.data.url) {
            uploadedUrls = [response.data.url]; // Single URL case
          } else if (response.data.urls) {
            uploadedUrls = response.data.urls; // Array of URLs case
          }
          if (!uploadedUrls.length) {
            console.warn("No URLs returned from backend for classroom images");
          }
          setClassroomImages((prev) => [...prev, ...uploadedUrls]);
          setClassroomPreviews((prev) => [
            ...prev.slice(0, prev.length - fileURLs.length),
            ...uploadedUrls,
          ]);
        }
      } catch (error) {
        console.error("Classroom images upload failed:", error);
        setErrors((prev) => ({
          ...prev,
          classroom:
            error.response?.data?.message ||
            "Failed to upload classroom images",
        }));
        setClassroomPreviews((prev) =>
          prev.filter((_, i) => i < prev.length - files.length)
        );
      } finally {
        setIsImgUploading(false);
      }
    },
    [VITE_BACKEND_BASE_URL]
  );

  const handleDemoUpload = useCallback(
    async (e) => {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      const fileErrors = validateFiles(files, "video");
      if (fileErrors.length) {
        setErrors((prev) => ({ ...prev, demo: fileErrors.join(" ") }));
        return;
      }
      setErrors((prev) => ({ ...prev, demo: null }));

      const fileURLs = files.map((file) => URL.createObjectURL(file));
      setDemoPreviews((prev) => [...prev, ...fileURLs]);
      setIsDemoUploading(true);

      try {
        const formData = new FormData();
        files.forEach((file) => formData.append("video", file));

        const response = await axios.patch(
          `${VITE_BACKEND_BASE_URL}/api/institutes/upload/video`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        console.log("Demo video upload response:", response.data);
        if (response.status === 200) {
          let uploadedUrls = [];
          if (response.data.url) {
            uploadedUrls = [response.data.url]; // Single URL case
          } else if (response.data.urls) {
            uploadedUrls = response.data.urls; // Array of URLs case
          }
          if (!uploadedUrls.length) {
            console.warn("No URLs returned from backend for demo videos");
          }
          setDemoVideos((prev) => [...prev, ...uploadedUrls]);
          setDemoPreviews((prev) => [
            ...prev.slice(0, prev.length - fileURLs.length),
            ...uploadedUrls,
          ]);
        }
      } catch (error) {
        console.error("Demo videos upload failed:", error);
        setErrors((prev) => ({
          ...prev,
          demo: error.response?.data?.message || "Failed to upload demo videos",
        }));
        setDemoPreviews((prev) =>
          prev.filter((_, i) => i < prev.length - files.length)
        );
      } finally {
        setIsDemoUploading(false);
      }
    },
    [VITE_BACKEND_BASE_URL]
  );

  const handleTourUpload = useCallback(
    async (e) => {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      const fileErrors = validateFiles(files, "video");
      if (fileErrors.length) {
        setErrors((prev) => ({ ...prev, tour: fileErrors.join(" ") }));
        return;
      }
      setErrors((prev) => ({ ...prev, tour: null }));

      const fileURLs = files.map((file) => URL.createObjectURL(file));
      setTourPreviews((prev) => [...prev, ...fileURLs]);
      setIsTourUploading(true);

      try {
        const formData = new FormData();
        files.forEach((file) => formData.append("video", file));

        const response = await axios.patch(
          `${VITE_BACKEND_BASE_URL}/api/institutes/upload/video`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        console.log("Tour video upload response:", response.data);
        if (response.status === 200) {
          let uploadedUrls = [];
          if (response.data.url) {
            uploadedUrls = [response.data.url]; // Single URL case
          } else if (response.data.urls) {
            uploadedUrls = response.data.urls; // Array of URLs case
          }
          if (!uploadedUrls.length) {
            console.warn("No URLs returned from backend for tour videos");
          }
          setTourVideos((prev) => [...prev, ...uploadedUrls]);
          setTourPreviews((prev) => [
            ...prev.slice(0, prev.length - fileURLs.length),
            ...uploadedUrls,
          ]);
        }
      } catch (error) {
        console.error("Tour videos upload failed:", error);
        setErrors((prev) => ({
          ...prev,
          tour: error.response?.data?.message || "Failed to upload tour videos",
        }));
        setTourPreviews((prev) =>
          prev.filter((_, i) => i < prev.length - files.length)
        );
      } finally {
        setIsTourUploading(false);
      }
    },
    [VITE_BACKEND_BASE_URL]
  );

  const removeClassroomImage = useCallback((index) => {
    setClassroomImages((prev) => prev.filter((_, i) => i !== index));
    setClassroomPreviews((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const removeDemoVideo = useCallback((index) => {
    setDemoVideos((prev) => prev.filter((_, i) => i !== index));
    setDemoPreviews((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const removeTourVideo = useCallback((index) => {
    setTourVideos((prev) => prev.filter((_, i) => i !== index));
    setTourPreviews((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};

    console.log("Validating form:", {
      classroomImages,
      demoVideos,
      tourVideos,
    });

    if (classroomImages.length === 0) {
      newErrors.classroom = "At least one classroom image is required.";
    }
    if (demoVideos.length === 0) {
      newErrors.demo = "At least one demo video is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [classroomImages, demoVideos]);

  const handleEditClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (
        !validateForm() ||
        isSubmitting ||
        isImgUploading ||
        isDemoUploading ||
        isTourUploading
      ) {
        console.log("Validation or upload in progress:", {
          validateForm: validateForm(),
          isSubmitting,
          isImgUploading,
          isDemoUploading,
          isTourUploading,
        });
        return;
      }
      setIsSubmitting(true);

      const payload = {
        classroomImages,
        demoVideos,
        tourVideos,
      };
      console.log("📝 Submitting Payload:", payload);

      try {
        const response = await axios.patch(
          `${VITE_BACKEND_BASE_URL}/api/institutes/me/media`,
          payload,
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.status === 200) {
          console.log("Media submitted successfully:", response.data);
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          localStorage.removeItem(LOCAL_STORAGE_PREVIEWS_KEY);
          navigate("/institute/social");
        }
      } catch (error) {
        console.error("Submission failed:", error);
        setErrors({
          submit:
            error.response?.data?.message || "Failed to submit media gallery",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      classroomImages,
      demoVideos,
      tourVideos,
      isSubmitting,
      isImgUploading,
      isDemoUploading,
      isTourUploading,
      validateForm,
      navigate,
      VITE_BACKEND_BASE_URL,
    ]
  );

  return (
    <div className="p-5 min-h-screen bg-[#E4EEE3]">
      <RegistrationNavigation />
      <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
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
                  onClick={() => isEditing && classroomInputRef.current.click()}
                />
                {isEditing && (
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                    onClick={() => removeClassroomImage(idx)}
                    aria-label="Remove classroom image"
                  >
                    <FaTrash size={12} />
                  </button>
                )}
              </div>
            ))}
            {isEditing && (
              <div
                className={`w-32 h-24 flex flex-col items-center justify-center border border-dashed border-gray-400 rounded cursor-pointer text-gray-500 hover:bg-gray-100 ${
                  isImgUploading ? "cursor-not-allowed" : ""
                }`}
                onClick={() =>
                  !isImgUploading && classroomInputRef.current.click()
                }
                aria-label="Add classroom images"
              >
                {isImgUploading ? (
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
                  <>
                    <FiUpload className="text-3xl mb-1" />
                    Add Images
                  </>
                )}
              </div>
            )}
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              multiple
              className="hidden"
              ref={classroomInputRef}
              onChange={handleClassroomUpload}
              disabled={!isEditing}
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
                  onClick={() => isEditing && demoInputRef.current.click()}
                />
                {isEditing && (
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                    onClick={() => removeDemoVideo(idx)}
                    aria-label="Remove demo video"
                  >
                    <FaTrash size={12} />
                  </button>
                )}
              </div>
            ))}
            {isEditing && (
              <div
                className={`w-40 h-28 flex flex-col items-center justify-center border border-dashed border-gray-400 rounded cursor-pointer text-gray-500 hover:bg-gray-100 ${
                  isDemoUploading ? "cursor-not-allowed" : ""
                }`}
                onClick={() => !isDemoUploading && demoInputRef.current.click()}
                aria-label="Add demo videos"
              >
                {isDemoUploading ? (
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
                  <>
                    <FiUpload className="text-3xl mb-1" />
                    Add Videos
                  </>
                )}
              </div>
            )}
            <input
              type="file"
              accept="video/mp4,video/webm"
              multiple
              className="hidden"
              ref={demoInputRef}
              onChange={handleDemoUpload}
              disabled={!isEditing}
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
                  onClick={() => isEditing && tourInputRef.current.click()}
                />
                {isEditing && (
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                    onClick={() => removeTourVideo(idx)}
                    aria-label="Remove tour video"
                  >
                    <FaTrash size={12} />
                  </button>
                )}
              </div>
            ))}
            {isEditing && (
              <div
                className={`w-40 h-28 flex flex-col items-center justify-center border border-dashed border-gray-400 rounded cursor-pointer text-gray-500 hover:bg-gray-100 ${
                  isTourUploading ? "cursor-not-allowed" : ""
                }`}
                onClick={() => !isTourUploading && tourInputRef.current.click()}
                aria-label="Add tour videos"
              >
                {isTourUploading ? (
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
                  <>
                    <FiUpload className="text-3xl mb-1" />
                    Add Videos
                  </>
                )}
              </div>
            )}
            <input
              type="file"
              accept="video/mp4,video/webm"
              multiple
              className="hidden"
              ref={tourInputRef}
              onChange={handleTourUpload}
              disabled={!isEditing}
            />
          </div>
          {errors.tour && (
            <p className="text-red-600 mt-2 text-sm">{errors.tour}</p>
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
          onClick={() => navigate("/institute/facilities")}
          className="flex items-center px-6 py-2 rounded-full text-white font-medium bg-[#204B54] hover:bg-[#2D7A66] transition"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        {!isEditing ? (
          <button
            type="button"
            onClick={handleEditClick}
            className="flex items-center px-6 py-2 rounded-full text-white font-medium bg-[#204B54] hover:bg-[#2D7A66] transition"
          >
            Edit
          </button>
        ) : (
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              isImgUploading ||
              isDemoUploading ||
              isTourUploading
            }
            className={`flex items-center px-6 py-2 rounded-full text-white font-medium transition ${
              isSubmitting ||
              isImgUploading ||
              isDemoUploading ||
              isTourUploading
                ? "bg-[#2D7B67] cursor-not-allowed"
                : "bg-[#204B54] hover:bg-[#2D7B67]"
            }`}
          >
            {isSubmitting ? "Saving..." : "Save & Next"}
            {!isSubmitting &&
              !isImgUploading &&
              !isDemoUploading &&
              !isTourUploading && <FaArrowRight className="ml-2" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default MediaGalleryPage;
