import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaPlus,
  FaTrash,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";
import RegistrationNavigation from "../../components/Institute/RegistrationNavigation";
import { assets } from "../../assets/assets";

const defaultAchievement = {
  instituteName: "",
  department: "",
  title: "",
  description: "",
  type: "",
  date: "",
  level: "",
  award: "",
  documents: [],
};

const InstituteAchievementsPage = () => {
  const [achievements, setAchievements] = useState([
    {
      ...defaultAchievement,
    },
  ]);
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [errors, setErrors] = useState({});
  const [declarationChecked, setDeclarationChecked] = useState(false);
  const navigate = useNavigate();

  const toggleExpand = (idx) =>
    setExpandedIndex(expandedIndex === idx ? null : idx);

  const validate = () => {
    const errs = {};
    let validExists = false;

    achievements.forEach((a, idx) => {
      const ae = {};
      const filled = Object.values(a).some((v) => {
        if (Array.isArray(v)) return v.length > 0;
        return v?.trim?.();
      });

      if (filled) {
        if (!a.instituteName.trim()) ae.instituteName = "Required";
        if (!a.department.trim()) ae.department = "Required";
        if (!a.title.trim()) ae.title = "Required";
        if (!a.description.trim()) ae.description = "Required";
        if (!a.type.trim()) ae.type = "Required";
        if (!a.date) ae.date = "Required";
        if (!a.level.trim()) ae.level = "Required";
        if (!a.award.trim()) ae.award = "Required";
      }

      if (!Object.keys(ae).length && a.title.trim()) validExists = true;
      if (Object.keys(ae).length) errs[idx] = ae;
    });

    if (!validExists) errs.form = "At least one complete achievement required";
    if (!declarationChecked) errs.declaration = "Please accept the declaration";

    setErrors(errs);
    return !Object.keys(errs).length;
  };

  const handleChange = (idx, field, value) => {
    setAchievements((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  const handleFileChange = (idx, files) => {
    const fileArray = Array.from(files);
    setAchievements((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], documents: fileArray };
      return updated;
    });
  };

  const addAchievement = () =>
    setAchievements((prev) => [...prev, { ...defaultAchievement }]);
  const removeAchievement = (idx) =>
    setAchievements((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const valid = achievements.filter((a) => a.title.trim());
    const formData = new FormData();

    valid.forEach((a, idx) => {
      formData.append(
        `achievement[${idx}]`,
        JSON.stringify({
          instituteName: a.instituteName,
          department: a.department,
          title: a.title,
          description: a.description,
          type: a.type,
          date: a.date,
          level: a.level,
          award: a.award,
        })
      );
      a.documents.forEach((doc, dIndex) => {
        formData.append(`achievement[${idx}].documents`, doc);
      });
    });

    try {
      const res = await fetch("/api/institutes/me/achievements", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (res.ok) navigate("/facilities");
      else throw new Error();
    } catch {
      setErrors({ submit: "Submission failed. Try again." });
    }
  };

  return (
    <div className="p-5 min-h-screen bg-[#E4EEE3] ">
       <div className="relative">
                    <button
                      type="button"
                      onClick={addAchievement}
                      className="text-sm sm:text-base  absolute top-[2.8rem] right-2 sm:right-5 bg-[#204B54] text-white rounded-full flex justify-center items-center px-6 py-3"
                    >
                      <FaPlus className="mr-2" />
                      ADD
                    </button>
                  </div>
      

      <RegistrationNavigation />

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        {achievements.map((a, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-300 rounded-xl shadow-md"
          >
            <div
              onClick={() => toggleExpand(idx)}
              className="p-4 flex justify-between items-center cursor-pointer"
            >
              <h3 className="text-lg font-semibold">Achievement {idx + 1}</h3>
              <div className="flex items-center gap-3">
                {achievements.length > 1 && (
                  <FaTrash
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAchievement(idx);
                    }}
                  />
                )}
                {expandedIndex === idx ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </div>

            {expandedIndex === idx && (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ["Institute Name", "instituteName"],
                  ["Department", "department"],
                  ["Achievement Title", "title"],
                  ["Achievement Type", "type"],
                  ["Level", "level"],
                  ["Award Received", "award"],
                ].map(([label, field]) => (
                  <div key={field}>
                    <label className="font-medium">{label}</label>
                    <input
                      type="text"
                      className="mt-1 w-full border-gray-300 rounded p-2 focus:ring-[#2D7A66] border"
                      value={a[field]}
                      onChange={(e) => handleChange(idx, field, e.target.value)}
                    />
                    {errors[idx]?.[field] && (
                      <p className="text-red-500 text-sm">
                        {errors[idx][field]}
                      </p>
                    )}
                  </div>
                ))}

                <div>
                  <label className="font-medium">Achievement Date</label>
                  <input
                    type="date"
                    className="mt-1 w-full border-gray-300 rounded p-2 focus:ring-[#2D7A66] border"
                    value={a.date}
                    onChange={(e) => handleChange(idx, "date", e.target.value)}
                  />
                  {errors[idx]?.date && (
                    <p className="text-red-500 text-sm">{errors[idx].date}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="font-medium">Description</label>
                  <textarea
                    rows={3}
                    className="mt-1 w-full border border-gray-300 rounded p-2 focus:ring-[#2D7A66] resize-none"
                    value={a.description}
                    onChange={(e) =>
                      handleChange(idx, "description", e.target.value)
                    }
                  />
                  {errors[idx]?.description && (
                    <p className="text-red-500 text-sm">
                      {errors[idx].description}
                    </p>
                  )}
                </div>

                {/* Supporting Documents Upload */}
                <div className="md:col-span-2">
                  <label className="font-medium">
                    Supporting Documents{" "}
                    <span className="text-gray-500">(Image/PDF)</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    multiple
                    className="mt-1 w-full border-gray-300 rounded p-2 border"
                    onChange={(e) => handleFileChange(idx, e.target.files)}
                  />
                  <div className="mt-2 flex flex-wrap gap-3">
                    {a.documents.map((doc, dIdx) => (
                      <div key={dIdx} className="relative">
                        {doc.type.startsWith("image/") ? (
                          <img
                            src={URL.createObjectURL(doc)}
                            alt={`doc-${dIdx}`}
                            className="w-24 h-24 object-cover rounded border"
                          />
                        ) : (
                          <div className="w-24 h-24 flex items-center justify-center bg-gray-100 border rounded">
                            <span className="text-sm text-gray-700">PDF</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {errors.form && (
          <p className="text-red-500 text-center">{errors.form}</p>
        )}


         
          <div className="flex justify-between items-center p-4 mt-4">
            <button
              type="button"
              onClick={() => navigate("/institute/student-achievements")}
               className="flex items-center px-6 py-2 rounded-full bg-[#204B54] text-white"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex items-center text-white px-6 py-2 rounded-full bg-[#204B54]"
            >
             Save & Next
            </button>
          </div>
       

        {errors.submit && (
          <p className="text-red-500 text-center">{errors.submit}</p>
        )}
      </form>
    </div>
  );
};

export default InstituteAchievementsPage;
