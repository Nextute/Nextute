import React from "react";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaYoutube,
  FaTiktok,
  FaSnapchatGhost,
  FaPinterest,
  FaTelegramPlane,
  FaReddit,
  FaDiscord,
  FaQuora,
  FaWeibo,
  FaGlobe,
  FaWhatsapp,
} from "react-icons/fa";
import { SiThreads, SiMastodon } from "react-icons/si";

const SocialMedia = ({ data }) => {
  const platformConfig = {
    facebook: {
      icon: <FaFacebook />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      label: "Facebook",
    },
    instagram: {
      icon: <FaInstagram />,
      color: "text-pink-500",
      bgColor: "bg-pink-50",
      label: "Instagram",
    },
    youtube: {
      icon: <FaYoutube />,
      color: "text-red-600",
      bgColor: "bg-red-50",
      label: "YouTube",
    },
    tiktok: {
      icon: <FaTiktok />,
      color: "text-gray-900",
      bgColor: "bg-gray-50",
      label: "TikTok",
    },
    twitter: {
      icon: <FaTwitter />,
      color: "text-blue-400",
      bgColor: "bg-blue-50",
      label: "Twitter",
    },
    linkedin: {
      icon: <FaLinkedin />,
      color: "text-blue-700",
      bgColor: "bg-blue-50",
      label: "LinkedIn",
    },
    whatsapp: {
      icon: <FaWhatsapp />,
      color: "text-green-600",
      bgColor: "bg-green-50",
      label: "WhatsApp",
    },
    snapchat: {
      icon: <FaSnapchatGhost />,
      color: "text-yellow-400",
      bgColor: "bg-yellow-50",
      label: "Snapchat",
    },
    pinterest: {
      icon: <FaPinterest />,
      color: "text-red-500",
      bgColor: "bg-red-50",
      label: "Pinterest",
    },
    telegram: {
      icon: <FaTelegramPlane />,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      label: "Telegram",
    },
    reddit: {
      icon: <FaReddit />,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      label: "Reddit",
    },
    discord: {
      icon: <FaDiscord />,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
      label: "Discord",
    },
    quora: {
      icon: <FaQuora />,
      color: "text-red-700",
      bgColor: "bg-red-50",
      label: "Quora",
    },
    weibo: {
      icon: <FaWeibo />,
      color: "text-red-600",
      bgColor: "bg-red-50",
      label: "Weibo",
    },
    threads: {
      icon: <SiThreads />,
      color: "text-gray-800",
      bgColor: "bg-gray-50",
      label: "Threads",
    },
    mastodon: {
      icon: <SiMastodon />,
      color: "text-blue-700",
      bgColor: "bg-blue-50",
      label: "Mastodon",
    },
    wechat: {
      icon: <FaGlobe />,
      color: "text-green-700",
      bgColor: "bg-green-50",
      label: "WeChat",
    },
    default: {
      icon: <FaGlobe />,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      label: "Website",
    },
  };

  const socialLinks = (() => {
    const social = data?.socialMedia || {};
    const knownLinks = { ...social };
    const otherLinks = Array.isArray(social.other) ? social.other : [];

    delete knownLinks.other;

    const knownMapped = Object.entries(knownLinks)
      .filter(([_, url]) => typeof url === "string" && url.trim() !== "")
      .map(([platform, url]) => ({
        platform: platform.trim().toLowerCase(),
        url,
        config:
          platformConfig[platform.trim().toLowerCase()] ||
          platformConfig.default,
      }));

    const otherMapped = otherLinks
      .filter(
        (item) =>
          typeof item === "object" &&
          item !== null &&
          typeof item.label === "string" &&
          typeof item.link === "string" &&
          item.label.trim() !== "" &&
          item.link.trim() !== ""
      )
      .map((item) => ({
        platform: item.label.trim().toLowerCase(),
        url: item.link,
        config:
          platformConfig[item.label.trim().toLowerCase()] ||
          platformConfig.default,
      }));

    const combinedLinks = [...knownMapped, ...otherMapped];
    const uniqueLinks = [];
    const seen = new Set();

    for (const link of combinedLinks) {
      const key = `${link.platform}:${link.url}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueLinks.push(link);
      }
    }

    return uniqueLinks;
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-4 sm:space-y-6"
    >
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 text-center">
        Connect With Us
      </h2>
      {socialLinks.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 ">
          {socialLinks.map(({ platform, url, config }, index) => (
            <motion.a
              key={`${platform}:${url}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full ${config.bgColor} ${config.color} shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#2D7A67] focus:ring-opacity-50 group relative`}
              aria-label={`Follow us on ${config.label}`}
            >
              <span className="text-lg sm:text-xl">{config.icon}</span>
              <span className="absolute bottom-full mb-2 hidden group-hover:block text-xs sm:text-sm bg-gray-800 text-white rounded px-2 py-1">
                {config.label}
              </span>
            </motion.a>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center text-sm sm:text-base">
          No social media links available.
        </p>
      )}
    </motion.div>
  );
};

export default SocialMedia;
