import { useState, useEffect } from "react";
import logo from "../../../assets/logo.svg";
import dashboard from "../../../assets/dashboard.svg";
import teachers from "../../../assets/teacher.svg";
import media from "../../../assets/media.svg";
import batches from "../../../assets/batches.svg";
import { useNavigate, useLocation } from "react-router-dom";

const SidePanel = () => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: dashboard,
      route: "/institute/dashboard",
    },
    {
      id: "teachers",
      label: "Teachers",
      icon: teachers,
      route: "/institute/teachers",
    },
    {
      id: "batches",
      label: "Batches",
      icon: batches,
      route: "/institute/batches",
    },
    {
      id: "media",
      label: "Media & photo",
      icon: media,
      route: "/institute/media",
    },
  ];
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentItem = menuItems.find(
      (item) => item.route.toLowerCase() === location.pathname.toLowerCase()
    );
    if (currentItem) {
      setActiveItem(currentItem.id);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen w-[20vw] flex-shrink-0 bg-[#E6EDE2] border-r border-black">
      <div className="">
        <img
          src={logo}
          alt="Company Logo"
          className="w-32 sm:w-40 mx-auto -my-6"
        />
      </div>
      <div className="flex flex-col gap-6 justify-center px-7">
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(item.route)}
            className="flex items-center gap-6 rounded-lg cursor-pointer transition-all duration-200"
          >
            <div
              className={`w-16 h-16 flex items-center justify-center ${
                activeItem === item.id ? "bg-[#93E9A2] rounded-full" : ""
              }`}
            >
              <img
                src={item.icon}
                alt={`${item.label} Icon`}
                className="sm:w-8 sm:h-8 w-16 h-16"
              />
            </div>
            <h1
              className={`text-2xl font-medium hidden sm:block ${
                activeItem === item.id ? "text-[#144E53]" : "text-black"
              }`}
            >
              {item.label}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidePanel;
