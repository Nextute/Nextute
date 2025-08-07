import React from "react";
import { motion } from "framer-motion";

const Button = ({
  variant = "primary",
  size = "md",
  children,
  disabled,
  className,
  ...props
}) => {
  const baseStyles =
    "flex items-center justify-center gap-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#93E9A2] font-medium shadow-sm";

  const variants = {
    primary: `bg-[#2D7A66] text-white hover:bg-[#144E53] ${
      disabled ? "cursor-not-allowed opacity-50" : "hover:shadow-md"
    }`,
    secondary: `bg-[#E6EDE2] text-[#144E53] border border-[#2D7A66]/20 hover:bg-[#93E9A2] ${
      disabled ? "cursor-not-allowed opacity-50" : "hover:shadow-md"
    }`,
    danger: `bg-red-600 text-white hover:bg-red-700 ${
      disabled ? "cursor-not-allowed opacity-50" : "hover:shadow-md"
    }`,
  };

  const sizes = {
    sm: "px-3 py-1 text-xs sm:text-sm",
    md: "px-4 py-1.5 text-sm sm:text-base",
    lg: "px-5 py-2 text-base sm:text-lg",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05, y: disabled ? 0 : -2 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      whileFocus={{ scale: disabled ? 1 : 1.02 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
