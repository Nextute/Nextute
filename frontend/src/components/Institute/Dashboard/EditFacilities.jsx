import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Edit, Trash2 } from "lucide-react";
import SidePanel from "./SidePanel";
import { useInstituteData } from "../../../hooks/useInstituteData.js";
import LoadingSpinner from "../../LoadingSpinner.jsx";
import Button from "../../ui/Button";
import InputField from "../../ui/InputField";
import SelectField from "../../ui/SelectField";
import Navbar from "../../Navbar.jsx";
import Footer from "../../Footer.jsx";

const FacilityCard = ({ facility, onEdit, onDelete }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ translateY: -5, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" }}
    transition={{ duration: 0.3, ease: "ux" }}
    className="mb-3 sm:mb-4 p-3 sm:p-4 rounded-lg bg-gradient-to-br from-white to-[#E6EDE2] bg-opacity-95 backdrop-blur-xl border border-[#2D7A66]/10 hover:shadow-lg transition-all duration-300"
  >
    <div className="flex justify-between items-start gap-3 sm:gap-4">
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-[#2D7A66] truncate">
          {facility.name}
        </h3>
        <p className="text-gray-700 text-xs sm:text-sm line-clamp-2">
          {facility.description}
        </p>
        <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
          Icon: {facility.icon || "None"}
        </p>
      </div>
      <div className="flex gap-2 sm:gap-3 shrink-0">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onEdit}
          className="p-2 bg-white rounded-full text-[#2D7A66] hover:bg-[#93E9A2] transition-all duration-200 shadow-sm"
          aria-label={`Edit ${facility.name}`}
        >
          <Edit className="w-4 sm:w-5 h-4 sm:h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onDelete}
          className="p-2 bg-white rounded-full text-red-600 hover:bg-red-100 transition-all duration-200 shadow-sm"
          aria-label={`Delete ${facility.name}`}
        >
          <Trash2 className="w-4 sm:w-5 h-4 sm:h-5" />
        </motion.button>
      </div>
    </div>
  </motion.div>
);

const EditFacilities = () => {
  const navigate = useNavigate();
  const { instituteDashboardData, dataLoading, hasRenderedOnce } =
    useInstituteData();
  const [facilities, setFacilities] = useState([]);
  const [newFacility, setNewFacility] = useState({
    id: "",
    name: "",
    description: "",
    icon: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const iconOptions = [
    { value: "", label: "Select Icon" },
    { value: "library", label: "Library" },
    { value: "computer", label: "Computer Lab" },
    { value: "projector", label: "Projector" },
    { value: "wifi", label: "Wi-Fi" },
    { value: "classroom", label: "Classroom" },
    { value: "lab", label: "Science Lab" },
  ];

  // Welcome back popup
  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedEditFacilities");
    if (hasVisited) {
      toast(
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <h3 className="text-lg font-semibold text-[#144E53]">
              Welcome Back!
            </h3>
            <p className="text-sm text-gray-600">
              Manage your institute's facilities with ease.
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
    localStorage.setItem("hasVisitedEditFacilities", "true");
  }, []);

  // Fetch facilities data
  useEffect(() => {
    if (!dataLoading && hasRenderedOnce && instituteDashboardData) {
      try {
        const parsedData =
          JSON.parse(instituteDashboardData.facilities || "{}").facilities ||
          [];
        setFacilities(
          parsedData.map((item, index) => ({
            ...item,
            id: `facility-${index}`,
          }))
        );
      } catch (err) {
        toast.error("Error loading facilities", {
          position: "top-right",
          duration: 3000,
          style: {
            background: "#E6EDE2",
            color: "#144E53",
            borderRadius: "8px",
          },
        });
      }
    }
  }, [instituteDashboardData, dataLoading, hasRenderedOnce]);

  const validateForm = () => {
    const newErrors = {};
    if (!newFacility.name.trim()) newErrors.name = "Name is required";
    if (!newFacility.description.trim())
      newErrors.description = "Description is required";
    if (!newFacility.icon) newErrors.icon = "Icon is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFacility((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAddOrEdit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      if (isEditing) {
        setFacilities((prev) =>
          prev.map((fac) => (fac.id === newFacility.id ? newFacility : fac))
        );
        toast.success("Facility updated successfully!", {
          position: "top-right",
          duration: 2000,
          style: {
            background: "#E6EDE2",
            color: "#144E53",
            borderRadius: "8px",
          },
        });
      } else {
        setFacilities((prev) => [
          ...prev,
          { ...newFacility, id: `facility-${Date.now()}` },
        ]);
        toast.success("Facility added successfully!", {
          position: "top-right",
          duration: 2000,
          style: {
            background: "#E6EDE2",
            color: "#144E53",
            borderRadius: "8px",
          },
        });
      }
      setNewFacility({ id: "", name: "", description: "", icon: "" });
      setIsEditing(false);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleEdit = (facility) => {
    setNewFacility(facility);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    toast(
      <div className="flex flex-col gap-2">
        <p>Are you sure you want to delete this facility?</p>
        <div className="flex gap-2">
          <Button
            variant="danger"
            onClick={() => {
              setFacilities((prev) => prev.filter((fac) => fac.id !== id));
              toast.success("Facility deleted successfully!", {
                position: "top-right",
                duration: 2000,
                style: {
                  background: "#E6EDE2",
                  color: "#144E53",
                  borderRadius: "8px",
                },
              });
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

  const handleCancel = () => {
    setNewFacility({ id: "", name: "", description: "", icon: "" });
    setIsEditing(false);
    setErrors({});
  };

  if (dataLoading || !hasRenderedOnce) return <LoadingSpinner />;

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen bg-gray-100">
        <SidePanel />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex-1 p-4 sm:p-6 md:p-8 max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-4 sm:mb-6">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/institute/dashboard")}
              className="p-2 bg-[#E6EDE2] rounded-full text-[#2D7A66] hover:bg-[#93E9A2] transition-all cursor-pointer"
              aria-label="Back to Dashboard"
            >
              <ArrowLeft className="w-5 sm:w-6 h-5 sm:h-6" />
            </motion.div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#144E53] tracking-tight">
              Edit Facilities
            </h1>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-gradient-to-br from-white to-[#E6EDE2] bg-opacity-95 backdrop-blur-xl rounded-xl shadow-lg p-4 sm:p-6 border border-[#2D7A66]/10 mb-6 sm:mb-8"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-[#144E53] mb-4">
              {isEditing ? "Edit Facility" : "Add New Facility"}
            </h2>
            <form
              onSubmit={handleAddOrEdit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
            >
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <InputField
                  label="Name"
                  name="name"
                  value={newFacility.name}
                  onChange={handleInputChange}
                  error={errors.name}
                  required
                  placeholder="e.g., Library"
                  className="w-full"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <label className="text-sm font-medium text-[#144E53] block mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <motion.textarea
                  name="description"
                  value={newFacility.description}
                  onChange={handleInputChange}
                  className={`w-full p-3 border border-[#2D7A66] rounded-md focus:outline-none focus:ring-2 focus:ring-[#93E9A2] transition-all bg-[#E6EDE2] text-sm sm:text-base ${
                    errors.description ? "border-red-500" : ""
                  }`}
                  rows="3"
                  whileFocus={{ scale: 1.02 }}
                  aria-label="Facility Description"
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
              >
                <SelectField
                  label="Icon"
                  name="icon"
                  value={newFacility.icon}
                  onChange={handleInputChange}
                  options={iconOptions}
                  error={errors.icon}
                  required
                  className="w-full"
                />
              </motion.div>
              <div className="flex gap-3 sm:gap-4 mt-4 sm:col-span-2">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                  className="text-xs sm:text-sm"
                  aria-label={isEditing ? "Update Facility" : "Add Facility"}
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
                  ) : isEditing ? (
                    "Update"
                  ) : (
                    "Add"
                  )}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleCancel}
                  className="text-xs sm:text-sm"
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
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-gradient-to-br from-white to-[#E6EDE2] bg-opacity-95 backdrop-blur-xl rounded-xl shadow-lg p-4 sm:p-6 border border-[#2D7A66]/10"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-[#144E53] mb-4">
              Existing Facilities
            </h2>
            <div className="max-h-[300px] sm:max-h-[400px] overflow-y-auto pr-2">
              {facilities.length > 0 ? (
                facilities.map((facility, index) => (
                  <motion.div
                    key={facility.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <FacilityCard
                      facility={facility}
                      onEdit={() => handleEdit(facility)}
                      onDelete={() => handleDelete(facility.id)}
                    />
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-700 text-sm sm:text-base">
                  No facilities available.
                </p>
              )}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="mt-4 sm:mt-6"
          >
            <Button
              variant="secondary"
              onClick={() => navigate("/institute/dashboard")}
              className="text-xs sm:text-sm"
              aria-label="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Button>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default EditFacilities;
