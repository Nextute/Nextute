import React from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, Eye, Phone, Mail, User } from "lucide-react";
import { assets } from "../../../assets/assets";
import Button from "../../ui/Button";

const TeacherCard = ({
  teacher,
  onEdit,
  onDelete,
  onView,
  imageSize = "w-20 sm:w-24 h-20 sm:h-24",
}) => {
  const fullName = `${teacher.firstName} ${teacher.middleName || ""} ${
    teacher.lastName
  }`.trim();

  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white rounded-xl shadow-md p-4 sm:p-5 border border-[#2D7A66]/10 max-w-sm mx-auto"
    >
      <div className="flex flex-col items-center gap-4">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className={`${imageSize} rounded-full bg-gray-100 border-2 border-[#2D7A66] flex items-center justify-center overflow-hidden flex-shrink-0`}
        >
          <img
            src={teacher?.photo || assets.Not_found}
            alt={`${fullName} Photo`}
            className="w-full h-full object-cover"
            onError={(e) => (e.target.src = assets.Not_found)}
          />
        </motion.div>
        <div className="w-full text-center">
          <h2
            className="text-lg sm:text-xl font-semibold text-[#144E53] mb-2 truncate"
            title={fullName}
          >
            {fullName}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
            <p className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="font-medium text-[#2D7A66]">Subject:</span>
              <span className="truncate">{teacher.subject || "N/A"}</span>
            </p>
            <p className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="font-medium text-[#2D7A66]">Experience:</span>
              <span className="truncate">
                {teacher.experience ? `${teacher.experience} years` : "N/A"}
              </span>
            </p>
            <p className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="font-medium text-[#2D7A66]">Qualification:</span>
              <span className="truncate">{teacher.qualification || "N/A"}</span>
            </p>
            <p className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="font-medium text-[#2D7A66]">Gender:</span>
              <span className="truncate">{teacher.gender || "N/A"}</span>
            </p>
            <p className="flex items-center gap-2 justify-center sm:justify-start">
              <Phone className="text-[#2D7A66] w-4 h-4" />
              <span className="truncate">{teacher.contact || "N/A"}</span>
            </p>
            <p className="flex items-center gap-2 justify-center sm:justify-start">
              <Mail className="text-[#2D7A66] w-4 h-4" />
              <span className="truncate">{teacher.email || "N/A"}</span>
            </p>
          </div>
        </div>
        <div className="flex justify-center gap-2 sm:gap-3 w-full">
          <Button
            variant="primary"
            onClick={onEdit}
            className="text-xs sm:text-sm"
            aria-label={`Edit ${fullName}`}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="danger"
            onClick={onDelete}
            className="text-xs sm:text-sm"
            aria-label={`Delete ${fullName}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            onClick={onView}
            className="text-xs sm:text-sm"
            aria-label={`View ${fullName}`}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(TeacherCard);
