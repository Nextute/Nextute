import React from "react";
import { motion } from "framer-motion";
import {
  Edit,
  Trash2,
  Eye,
  Users,
  Book,
  DollarSign,
  Languages,
} from "lucide-react";
import { assets } from "../../../assets/assets";
import Button from "../../ui/Button";

const BatchCard = ({
  batch,
  onEdit,
  onDelete,
  onView,
  imageSize = "w-20 sm:w-24 h-20 sm:h-24",
  placeholderIcon = (
    <Users className="w-10 sm:w-12 h-10 sm:h-12 text-[#2D7A66]" />
  ),
}) => {
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
          {batch?.image ? (
            <img
              src={batch.image}
              alt={`${batch.name} Image`}
              className="w-full h-full object-cover"
              onError={(e) => (e.target.src = assets.Not_found)}
            />
          ) : (
            placeholderIcon
          )}
        </motion.div>
        <div className="w-full text-center">
          <h2
            className="text-lg sm:text-xl font-semibold text-[#144E53] mb-2 truncate"
            title={batch.name}
          >
            {batch.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
            <p className="flex items-center gap-2 justify-center sm:justify-start">
              <Book className="text-[#2D7A66] w-4 h-4" />
              <span className="truncate">{batch.category || "N/A"}</span>
            </p>
            <p className="flex items-center gap-2 justify-center sm:justify-start">
              <Users className="text-[#2D7A66] w-4 h-4" />
              <span className="truncate">{batch.details || "N/A"}</span>
            </p>
            <p className="flex items-center gap-2 justify-center sm:justify-start">
              <DollarSign className="text-[#2D7A66] w-4 h-4" />
              <span className="truncate">{batch.feeRange || "N/A"}</span>
            </p>
            <p className="flex items-center gap-2 justify-center sm:justify-start">
              <Languages className="text-[#2D7A66] w-4 h-4" />
              <span className="truncate">{batch.medium || "N/A"}</span>
            </p>
          </div>
        </div>
        <div className="flex justify-center gap-2 sm:gap-3 w-full">
          <Button
            variant="primary"
            size="sm"
            onClick={onEdit}
            className="text-xs sm:text-sm"
            aria-label={`Edit ${batch.name}`}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onDelete}
            className="text-xs sm:text-sm"
            aria-label={`Delete ${batch.name}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onView}
            className="text-xs sm:text-sm"
            aria-label={`View ${batch.name}`}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(BatchCard);
