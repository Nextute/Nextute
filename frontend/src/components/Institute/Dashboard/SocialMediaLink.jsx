import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaTelegram,
  FaWhatsapp,
  FaLink,
} from "react-icons/fa";

const platformIcons = {
  facebook: {
    icon: <FaFacebook className="w-6 h-6" />,
    hoverColor: "hover:bg-blue-600",
  },
  twitter: {
    icon: <FaTwitter className="w-6 h-6" />,
    hoverColor: "hover:bg-sky-500",
  },
  instagram: {
    icon: <FaInstagram className="w-6 h-6" />,
    hoverColor: "hover:bg-pink-500",
  },
  linkedin: {
    icon: <FaLinkedin className="w-6 h-6" />,
    hoverColor: "hover:bg-blue-700",
  },
  youtube: {
    icon: <FaYoutube className="w-6 h-6" />,
    hoverColor: "hover:bg-red-600",
  },
  telegram: {
    icon: <FaTelegram className="w-6 h-6" />,
    hoverColor: "hover:bg-teal-500",
  },
  whatsapp: {
    icon: <FaWhatsapp className="w-6 h-6" />,
    hoverColor: "hover:bg-green-500",
  },
  default: {
    icon: <FaLink className="w-6 h-6" />,
    hoverColor: "hover:bg-gray-500",
  },
};

const SocialMediaLink = ({ platform, url }) => {
  const { icon, hoverColor } =
    platformIcons[platform.toLowerCase()] || platformIcons.default;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`p-2 rounded-full text-[#2D7A66] ${hoverColor} transition-all duration-200 hover:text-white`}
      aria-label={`Follow on ${platform}`}
    >
      {icon}
    </a>
  );
};

export default SocialMediaLink;
