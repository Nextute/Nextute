import React from "react";
import { motion } from "framer-motion";

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required,
  ...props
}) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-[#144E53]">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <motion.select
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full p-3 border border-[#2D7A66] rounded-md focus:outline-none focus:ring-2 focus:ring-[#93E9A2] transition-all bg-[#E6EDE2] ${
        error ? "border-red-500" : ""
      }`}
      whileFocus={{ scale: 1.02 }}
      aria-label={label}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </motion.select>
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

export default SelectField;
