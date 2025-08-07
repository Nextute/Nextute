import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import SidePanel from "./SidePanel";
import { useInstituteData } from "../../../hooks/useInstituteData.js";
import AchievementCard from "./AchievementCard";
import Button from "../../ui/Button";
import InputField from "../../ui/InputField";
import Navbar from "../../Navbar.jsx";
import Footer from "../../Footer.jsx";

const EditAchievements = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const { instituteDashboardData } = useInstituteData();
  const [achievements, setAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState({
    id: "",
    title: "",
    description: "",
    date: "",
    level: "",
    award: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (instituteDashboardData) {
      const parsedData = JSON.parse(
        type === "institute"
          ? instituteDashboardData.institute_achievements
          : instituteDashboardData.student_achievements
      );
      setAchievements(parsedData.achievements);
    }
  }, [instituteDashboardData, type]);

  const validateForm = () => {
    const newErrors = {};
    if (!newAchievement.title.trim()) newErrors.title = "Title is required";
    if (!newAchievement.description.trim())
      newErrors.description = "Description is required";
    if (!newAchievement.date) newErrors.date = "Date is required";
    if (!newAchievement.level.trim()) newErrors.level = "Level is required";
    if (!newAchievement.award.trim()) newErrors.award = "Award is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAchievement((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAddOrEdit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      if (isEditing) {
        setAchievements((prev) =>
          prev.map((ach) =>
            ach.id === newAchievement.id ? newAchievement : ach
          )
        );
        toast.success("Achievement updated successfully!", {
          position: "top-right",
          duration: 2000,
          style: { background: "#E6EDE2", color: "#144E53" },
        });
      } else {
        setAchievements((prev) => [
          ...prev,
          { ...newAchievement, id: `${type}-${Date.now()}` },
        ]);
        toast.success("Achievement added successfully!", {
          position: "top-right",
          duration: 2000,
          style: { background: "#E6EDE2", color: "#144E53" },
        });
      }
      setNewAchievement({
        id: "",
        title: "",
        description: "",
        date: "",
        level: "",
        award: "",
      });
      setIsEditing(false);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleEdit = (achievement) => {
    setNewAchievement(achievement);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    setAchievements((prev) => prev.filter((ach) => ach.id !== id));
    toast.success("Achievement deleted successfully!", {
      position: "top-right",
      duration: 2000,
      style: { background: "#E6EDE2", color: "#144E53" },
    });
  };

  const handleCancel = () => {
    setNewAchievement({
      id: "",
      title: "",
      description: "",
      date: "",
      level: "",
      award: "",
    });
    setIsEditing(false);
    setErrors({});
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gray-100">
        <SidePanel />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 p-4 sm:p-6 md:p-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-[#144E53] mb-6">
            {type === "institute"
              ? "Edit Institute Achievements"
              : "Edit Student Achievements"}
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-white to-[#E6EDE2] bg-opacity-95 backdrop-blur-lg rounded-xl shadow-md p-6 border border-[#2D7A66]/20 mb-8"
          >
            <h2 className="text-xl font-semibold text-[#144E53] mb-4">
              {isEditing ? "Edit Achievement" : "Add New Achievement"}
            </h2>
            <form
              onSubmit={handleAddOrEdit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <InputField
                label="Title"
                name="title"
                value={newAchievement.title}
                onChange={handleInputChange}
                error={errors.title}
                required
              />
              <div>
                <label className="text-sm font-medium text-[#144E53]">
                  Description <span className="text-red-500">*</span>
                </label>
                <motion.textarea
                  name="description"
                  value={newAchievement.description}
                  onChange={handleInputChange}
                  className={`w-full p-3 border border-[#2D7A66] rounded-md focus:outline-none focus:ring-2 focus:ring-[#93E9A2] transition-all bg-[#E6EDE2] ${
                    errors.description ? "border-red-500" : ""
                  }`}
                  rows="3"
                  whileFocus={{ scale: 1.02 }}
                  aria-label="Achievement Description"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description}</p>
                )}
              </div>
              <InputField
                label="Date"
                name="date"
                type="date"
                value={newAchievement.date}
                onChange={handleInputChange}
                error={errors.date}
                required
              />
              <InputField
                label="Level"
                name="level"
                value={newAchievement.level}
                onChange={handleInputChange}
                error={errors.level}
                required
              />
              <InputField
                label="Award"
                name="award"
                value={newAchievement.award}
                onChange={handleInputChange}
                error={errors.award}
                required
              />
              <div className="flex gap-4 mt-4">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                  aria-label={
                    isEditing ? "Update Achievement" : "Add Achievement"
                  }
                >
                  {isSubmitting ? "Saving..." : isEditing ? "Update" : "Add"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleCancel}
                  aria-label="Cancel"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-white to-[#E6EDE2] bg-opacity-95 backdrop-blur-lg rounded-xl shadow-md p-6 border border-[#2D7A66]/20"
          >
            <h2 className="text-xl font-semibold text-[#144E53] mb-4">
              Existing Achievements
            </h2>
            <div className="max-h-[300px] overflow-y-auto pr-2">
              {achievements.length > 0 ? (
                achievements.map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    onEdit={() => handleEdit(achievement)}
                    onDelete={() => handleDelete(achievement.id)}
                  />
                ))
              ) : (
                <p className="text-gray-700">No achievements available.</p>
              )}
            </div>
          </motion.div>
          <Button
            variant="secondary"
            onClick={() => navigate("/institute/dashboard")}
            className="mt-6"
            aria-label="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Button>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default EditAchievements;
