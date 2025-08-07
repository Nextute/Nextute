import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { assets } from "../../../assets/assets.js";
import {
  Book,
  Target,
  Calendar,
  Monitor,
  School,
  Star,
  Clock,
  Heart,
  Link2,
  GraduationCap,
} from "lucide-react";
import { FaLinkedin, FaGithub, FaTwitter, FaInstagram } from "react-icons/fa";

const PreferencesSection = ({ studentData, isEditing }) => {
  const [formData, setFormData] = useState({
    languagePreference: studentData?.languagePreference || "English",
    hobbies: studentData?.hobbies || ["Reading", "Coding"],
    learningStyle: studentData?.learningStyle || "Visual",
    targetExams: studentData?.targetExams || ["JEE"],
    attemptYear: studentData?.attemptYear || "2025",
    studyMode: studentData?.studyMode || "Online",
    currentClass: studentData?.currentClass || "Class 12",
    careerGoal: studentData?.careerGoal || "Become a software engineer",
    preparationReason:
      studentData?.preparationReason || "To excel in my career!",
    studyHours: studentData?.studyHours || "4-6 hours",
    preferredTime: studentData?.preferredTime || "Morning",
    favoriteSubjects: studentData?.favoriteSubjects || [
      "Mathematics",
      "Physics",
    ],
    socialLinks: studentData?.socialLinks || {
      linkedin: "",
      github: "",
      twitter: "",
      instagram: "",
    },
    studyResources: studentData?.studyResources || ["Khan Academy", "NCERT"],
    mentorshipPreference: studentData?.mentorshipPreference || "One-on-one",
    studyGoals: studentData?.studyGoals || {
      shortTerm: "Complete syllabus by December",
      longTerm: "Top 1% in JEE",
    },
    extracurriculars: studentData?.extracurriculars || ["Debate Club"],
  });
  const refs = {
    languagePreference: useRef(null),
    currentClass: useRef(null),
    careerGoal: useRef(null),
    preparationReason: useRef(null),
    studyHours: useRef(null),
    preferredTime: useRef(null),
    mentorshipPreference: useRef(null),
    linkedin: useRef(null),
    github: useRef(null),
    twitter: useRef(null),
    instagram: useRef(null),
    shortTermGoal: useRef(null),
    longTermGoal: useRef(null),
  };

  const handleTagChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const fields = [
    {
      icon: <Book className="w-6 h-6 text-teal-900" />,
      label: "Language Preference",
      value: formData.languagePreference,
      onChange: (e) =>
        setFormData({ ...formData, languagePreference: e.target.value }),
      ref: refs.languagePreference,
      fieldKey: "languagePreference",
      editable: true,
      type: "select",
      options: ["English", "Hindi", "Spanish", "French"],
    },
    {
      icon: <Heart className="w-6 h-6 text-teal-900" />,
      label: "Hobbies & Interests",
      value: formData.hobbies,
      fieldKey: "hobbies",
      editable: true,
      type: "tags",
      options: ["Drawing", "Coding", "Cricket", "Debating", "Music", "Reading"],
    },
    {
      icon: <Book className="w-6 h-6 text-teal-900" />,
      label: "Learning Style",
      value: formData.learningStyle,
      onChange: (e) =>
        setFormData({ ...formData, learningStyle: e.target.value }),
      ref: refs.learningStyle,
      fieldKey: "learningStyle",
      editable: true,
      type: "select",
      options: ["Visual", "Auditory", "Reading", "Practice-Based"],
    },
    {
      icon: <Target className="w-6 h-6 text-teal-900" />,
      label: "Target Exams",
      value: formData.targetExams,
      fieldKey: "targetExams",
      editable: true,
      type: "tags",
      options: ["NEET", "JEE", "CUET", "CAT", "UPSC"],
    },
    {
      icon: <Calendar className="w-6 h-6 text-teal-900" />,
      label: "Attempt Year",
      value: formData.attemptYear,
      onChange: (e) =>
        setFormData({ ...formData, attemptYear: e.target.value }),
      ref: refs.attemptYear,
      fieldKey: "attemptYear",
      editable: true,
      type: "select",
      options: ["2025", "2026", "2027", "2028"],
    },
    {
      icon: <Monitor className="w-6 h-6 text-teal-900" />,
      label: "Study Mode",
      value: formData.studyMode,
      onChange: (e) => setFormData({ ...formData, studyMode: e.target.value }),
      ref: refs.studyMode,
      fieldKey: "studyMode",
      editable: true,
      type: "select",
      options: ["Online", "Offline", "Hybrid"],
    },
    {
      icon: <School className="w-6 h-6 text-teal-900" />,
      label: "Current Class/College",
      value: formData.currentClass,
      onChange: (e) =>
        setFormData({ ...formData, currentClass: e.target.value }),
      ref: refs.currentClass,
      fieldKey: "currentClass",
      editable: true,
      placeholder: "e.g. Class 12",
    },
    {
      icon: <Star className="w-6 h-6 text-teal-900" />,
      label: "Career Goal",
      value: formData.careerGoal,
      onChange: (e) => setFormData({ ...formData, careerGoal: e.target.value }),
      ref: refs.careerGoal,
      fieldKey: "careerGoal",
      editable: true,
      placeholder: "e.g. Become an IAS officer",
    },
    {
      icon: <Book className="w-6 h-6 text-teal-900" />,
      label: "Why are you preparing?",
      value: formData.preparationReason,
      onChange: (e) =>
        setFormData({ ...formData, preparationReason: e.target.value }),
      ref: refs.preparationReason,
      fieldKey: "preparationReason",
      editable: true,
      placeholder: "e.g. To achieve my dreams!",
      isTextArea: true,
    },
    {
      icon: <Clock className="w-6 h-6 text-teal-900 " />,
      label: "Study Hours per Day",
      value: formData.studyHours,
      onChange: (e) => setFormData({ ...formData, studyHours: e.target.value }),
      ref: refs.studyHours,
      fieldKey: "studyHours",
      editable: true,
      type: "select",
      options: ["2-4 hours", "4-6 hours", "6-8 hours", "8+ hours"],
    },
    {
      icon: <Clock className="w-6 h-6 text-teal-900" />,
      label: "Preferred Time of Day",
      value: formData.preferredTime,
      onChange: (e) =>
        setFormData({ ...formData, preferredTime: e.target.value }),
      ref: refs.preferredTime,
      fieldKey: "preferredTime",
      editable: true,
      type: "select",
      options: ["Morning", "Afternoon", "Night"],
    },
    {
      icon: <Book className="w-6 h-6 text-teal-900" />,
      label: "Favorite Subjects",
      value: formData.favoriteSubjects,
      fieldKey: "favoriteSubjects",
      editable: true,
      type: "tags",
      options: ["Mathematics", "Physics", "Chemistry", "Biology", "History"],
    },
    {
      icon: <Book className="w-6 h-6 text-teal-900" />,
      label: "Study Resources",
      value: formData.studyResources,
      fieldKey: "studyResources",
      editable: true,
      type: "tags",
      options: ["Khan Academy", "NCERT", "Coursera", "Byju's", "Unacademy"],
    },
    {
      icon: <Star className="w-6 h-6 text-teal-900" />,
      label: "Mentorship Preference",
      value: formData.mentorshipPreference,
      onChange: (e) =>
        setFormData({ ...formData, mentorshipPreference: e.target.value }),
      ref: refs.mentorshipPreference,
      fieldKey: "mentorshipPreference",
      editable: true,
      type: "select",
      options: ["One-on-one", "Group", "None"],
    },
    {
      icon: <Target className="w-6 h-6 text-teal-900" />,
      label: "Short-Term Study Goal",
      value: formData.studyGoals.shortTerm,
      onChange: (e) =>
        setFormData({
          ...formData,
          studyGoals: { ...formData.studyGoals, shortTerm: e.target.value },
        }),
      ref: refs.shortTermGoal,
      fieldKey: "shortTermGoal",
      editable: true,
      placeholder: "e.g. Complete syllabus by December",
    },
    {
      icon: <Target className="w-6 h-6 text-teal-900" />,
      label: "Long-Term Study Goal",
      value: formData.studyGoals.longTerm,
      onChange: (e) =>
        setFormData({
          ...formData,
          studyGoals: { ...formData.studyGoals, longTerm: e.target.value },
        }),
      ref: refs.longTermGoal,
      fieldKey: "longTermGoal",
      editable: true,
      placeholder: "e.g. Top 1% in JEE",
    },
    {
      icon: <Heart className="w-6 h-6 text-teal-900" />,
      label: "Extracurricular Activities",
      value: formData.extracurriculars,
      fieldKey: "extracurriculars",
      editable: true,
      type: "tags",
      options: [
        "Debate Club",
        "Sports",
        "NGO Volunteer",
        "Music Band",
        "Art Club",
      ],
    },
    {
      icon: <Link2 className="w-6 h-6 text-teal-900" />,
      label: "Social Links",
      value: formData.socialLinks,
      fieldKey: "socialLinks",
      editable: true,
      type: "social",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg p-8 bg-opacity-80 backdrop-blur-lg"
    >
      <div className="flex items-center gap-3 mb-6">
        <GraduationCap className="w-7 h-7 text-teal-500" />

        <h2 className="text-2xl font-bold text-gray-800">
          Learning Preferences
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {fields.map((field, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-3 mb-2">
              {field.icon}
              <h3 className="text-lg font-semibold text-gray-800">
                {field.label}
              </h3>
            </div>
            {field.type === "select" ? (
              <motion.select
                value={field.value}
                onChange={field.onChange}
                disabled={!isEditing}
                ref={field.ref}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex-1 p-3 rounded-lg border ${
                  isEditing
                    ? "border-teal-500 bg-white"
                    : "border-gray-300 bg-gray-100"
                } focus:outline-none focus:ring-2 focus:ring-teal-500 transition`}
              >
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </motion.select>
            ) : field.type === "tags" ? (
              <div className="flex flex-wrap gap-2">
                {field.options.map((option) => (
                  <motion.button
                    key={option}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      isEditing && handleTagChange(field.fieldKey, option)
                    }
                    disabled={!isEditing}
                    className={`px-3 py-1 rounded-full text-sm ${
                      formData[field.fieldKey].includes(option)
                        ? "bg-teal-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    } ${isEditing ? "hover:bg-teal-600" : ""} transition`}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            ) : field.type === "social" ? (
              <div className="flex-1 space-y-2">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2"
                >
                  <FaLinkedin className="w-6 h-8 text-blue-700 bg-blue-50" />
                  <input
                    type="text"
                    placeholder="LinkedIn URL"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: {
                          ...formData.socialLinks,
                          linkedin: e.target.value,
                        },
                      })
                    }
                    disabled={!isEditing}
                    ref={refs.linkedin}
                    className={`flex-1 p-3 rounded-lg border ${
                      isEditing
                        ? "border-teal-500 bg-white"
                        : "border-gray-300 bg-gray-100"
                    } focus:outline-none focus:ring-2 focus:ring-teal-500 transition`}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="flex items-center gap-2"
                >
                  <FaGithub className="w-6 h-8 text-gray-800 bg-gray-100" />
                  <input
                    type="text"
                    placeholder="GitHub URL"
                    value={formData.socialLinks.github}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: {
                          ...formData.socialLinks,
                          github: e.target.value,
                        },
                      })
                    }
                    disabled={!isEditing}
                    ref={refs.github}
                    className={`flex-1 p-3 rounded-lg border ${
                      isEditing
                        ? "border-teal-500 bg-white"
                        : "border-gray-300 bg-gray-100"
                    } focus:outline-none focus:ring-2 focus:ring-teal-500 transition`}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <FaTwitter className="w-6 h-8 text-blue-400 bg-blue-50" />
                  <input
                    type="text"
                    placeholder="Twitter URL"
                    value={formData.socialLinks.twitter}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: {
                          ...formData.socialLinks,
                          twitter: e.target.value,
                        },
                      })
                    }
                    disabled={!isEditing}
                    ref={refs.twitter}
                    className={`flex-1 p-3 rounded-lg border ${
                      isEditing
                        ? "border-teal-500 bg-white"
                        : "border-gray-300 bg-gray-100"
                    } focus:outline-none focus:ring-2 focus:ring-teal-500 transition`}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="flex items-center gap-2"
                >
                  <FaInstagram className="w-6 h-8 text-pink-500 bg-pink-50" />
                  <input
                    type="text"
                    placeholder="Instagram URL"
                    value={formData.socialLinks.instagram}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: {
                          ...formData.socialLinks,
                          instagram: e.target.value,
                        },
                      })
                    }
                    disabled={!isEditing}
                    ref={refs.instagram}
                    className={`flex-1 p-3 rounded-lg border ${
                      isEditing
                        ? "border-teal-500 bg-white"
                        : "border-gray-300 bg-gray-100"
                    } focus:outline-none focus:ring-2 focus:ring-teal-500 transition`}
                  />
                </motion.div>
              </div>
            ) : field.isTextArea ? (
              <motion.textarea
                placeholder={field.placeholder}
                value={field.value}
                onChange={field.onChange}
                disabled={!isEditing}
                ref={field.ref}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex-1 p-3 rounded-lg border ${
                  isEditing
                    ? "border-teal-500 bg-white"
                    : "border-gray-300 bg-gray-100"
                } focus:outline-none focus:ring-2 focus:ring-teal-500 transition min-h-[100px]`}
              />
            ) : (
              <motion.input
                type="text"
                placeholder={field.placeholder}
                value={field.value}
                onChange={field.onChange}
                disabled={!isEditing}
                ref={field.ref}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex-1 p-3 rounded-lg border ${
                  isEditing
                    ? "border-teal-500 bg-white"
                    : "border-gray-300 bg-gray-100"
                } focus:outline-none focus:ring-2 focus:ring-teal-500 transition`}
              />
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PreferencesSection;
