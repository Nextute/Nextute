import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { assets } from "../../../assets/assets.js";
import { Upload, Sparkles } from "lucide-react";
import Loader from "./Loader";

const ProfileSection = ({ studentData, isEditing }) => {
  const data = studentData || {};
  const [profile, setProfile] = useState({
    name: data.name || "Student Name",
    picture: assets.profileImage,
    completion: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!studentData) return;

    const calculateCompletion = () => {
      const fields = [
        data.name,
        data.gender,
        data.date_of_birth,
        data.student_id,
        data.phone_number,
        data.email,
        data.address,
        data.guardianName,
        data.guardianPhone,
        data.profileImage,
        data.city,
        data.state,
        data.languagePreference,
        data.bio,
        data.hobbies,
        data.learningStyle,
        data.targetExams,
        data.attemptYear,
        data.studyMode,
        data.currentClass,
        data.careerGoal,
        data.preparationReason,
        data.studyHours,
        data.preferredTime,
        data.favoriteSubjects,
        data.socialLinks?.linkedin,
        data.socialLinks?.github,
        data.socialLinks?.twitter,
        data.socialLinks?.instagram,
        data.certifications,
        data.achievements,
        data.studyResources,
        data.mentorshipPreference,
        data.studyGoals?.shortTerm,
        data.studyGoals?.longTerm,
        data.extracurriculars,
      ].filter(Boolean);
      return ((fields.length / 36) * 100).toFixed(0);
    };

    setProfile((prev) => ({
      ...prev,
      completion: calculateCompletion(),
      picture: data.profileImage || assets.profilePlaceholder,
      name: data.name || "Student Name",
    }));

    setTimeout(() => setIsLoading(false), 1000);
  }, [studentData]);

  const handlePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfile((prev) => ({
          ...prev,
          picture: event.target.result,
          completion:
            prev.completion < 100 ? parseInt(prev.completion) + 10 : 100,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10 w-full max-w-7xl mx-auto bg-opacity-90 backdrop-blur-lg"
    >
      <div className="flex flex-col gap-6 sm:gap-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden border-2 transition aspect-square"
          >
            {isLoading ? (
              <div className="w-full h-full bg-gray-200 animate-pulse rounded-full"></div>
            ) : (
              <img
                src={assets.upload_area || profile.picture}
                alt="Student Profile"
                className="w-full h-full object-cover rounded-full"
              />
            )}
            {isEditing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
              >
                <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePictureUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  aria-label="Upload profile picture"
                />
              </motion.div>
            )}
          </motion.div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
              {profile.name}
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Nextute Student
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 sm:gap-3">
          <Loader isLoading={isLoading} completion={profile.completion} />
          <p className="text-sm sm:text-base text-gray-600 font-medium">
            Profile Completed
          </p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="text-sm sm:text-base text-teal-600 italic font-medium max-w-xs text-center"
          >
            "Empower your future with knowledge!"
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileSection;
