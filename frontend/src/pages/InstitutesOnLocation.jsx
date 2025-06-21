import React, { useState } from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";
import { RectangleIcon } from "../components/RectangleIcon";
import { FaLocationDot } from "react-icons/fa6";
import { Search } from "lucide-react";
import Card from "../components/Card";
import Footer from "../components/Footer";

const filter = [
  { id: 1, name: "filter 1" },
  { id: 2, name: "filter 2" },
  { id: 3, name: "filter 3" },
  { id: 4, name: "filter 4" },
  { id: 5, name: "filter 5" },
  { id: 6, name: "filter 6" },
  { id: 7, name: "filter 7" },
];

const InstitutesOnLocation = () => {
  const [activeItemId, setActivePathId] = useState(1);

  return (
    <div>
      {/* ------------NAVBAR-------------- */}
      <div className="flex items-center justify-between ">
        {/* Logo */}
        <NavLink to="/">
          <img
            src={assets.logo}
            alt="Nextute Logo"
            className="w-28 sm:w-32 lg:w-40 ml-14"
          />
        </NavLink>

        {/* RIGHT SECTION -> NAV LINKS*/}
        <nav className="flex items-center gap-6 mr-32">
          <NavLink
            to="/services"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active-nav-link" : ""}`
            }
          >
            <p>Services</p>
          </NavLink>
          <button className="text-gray-700 px-7 py-2 cursor-pointer border border-gray-500 rounded-full">
            Login
          </button>

          <button className="bg-[#2D7B67] text-white px-7 py-2 cursor-pointer border border-gray-500 rounded-full">
            Sign Up
          </button>
        </nav>
      </div>

      {/* ------------HEADER CONTENT-------------- */}
      <div className="w-full max-w-7xl flex items-center justify-between gap-10 mx-auto px-4 mb-8">
        <h1 className=" w-full max-w-1/2 text-5xl font-semibold text-[#002639]">
          Popular Tutorials in Hajipur
        </h1>

        {/*--------SEARCH COMPONENT--------*/}
        <div className="flex items-center justify-between mt-4 w-full h-16 max-w-1/2 mx-auto shadow-custom border border-[#000000] rounded-full overflow-hidden">
          {/* Left:  Input + ICON */}
          <div className="flex items-center gap-2 ml-3 px-4 py-2 w-full">
            <FaLocationDot className="text-green-700 size-6" />
            <input
              type="text"
              placeholder="Search by name..."
              className="outline-none bg-[#FFFFFF] w-full text-gray-700 placeholder:[#000] placeholder:opacity-90 placeholder:text-xl"
            />
          </div>
          <div className="relative h-full w-full flex items-center justify-center px-4 py-2">
            {/* Background Rectangles */}
            <div className="relative flex items-center justify-center">
              {/* First Rectangle */}
              <RectangleIcon
                height={190}
                width={75}
                color="#204B55"
                className="absolute transform rotate-[51deg] translate-x-[200%] z-10 mix-blend-multiply"
              />
              {/* Second Rectangle */}
              <RectangleIcon
                height={160}
                width={50}
                color="#AAD294"
                className="absolute transform -rotate-[48deg] translate-x-[290%] z-10 mix-blend-multiply"
              />
              {/* Filter Icon */}
              <img
                src={assets.filter}
                alt="Filter Icon"
                className="size-4 translate-x-[225%] cursor-pointer"
              />
              {/* Search Icon */}
              <Search className="absolute translate-x-[550%] size-6 text-white z-50" />
            </div>
          </div>
        </div>
      </div>

      {/* ADEVRTISMENT CONTENT */}
      <div className="w-full max-w-7xl px-4 py-8 bg-gray-400 mx-auto rounded-2xl mb-8">
        <p className="text-black text-4xl md:text-6xl lg:text-8xl text-center font-bold">
          Advertisement
        </p>
      </div>

      {/*-------------FILTER CONTENT---------------*/}
      <div className="w-full max-w-7xl flex items-center justify-evenly mx-auto gap-20 overflow-x-auto scrollbar-hide">
        {filter.map((item) => (
          <div
            key={item.id}
            onClick={() => setActivePathId(item.id)}
            className={`flex-shrink-0 rounded-full px-6 py-1 cursor-pointer transition-colors duration-300 
            ${
              activeItemId === item.id
                ? "bg-[#2D7B67] text-white"
                : "bg-[#F8F7F8] text-[#000000]"
            }`}
          >
            <p className="text-lg md:text-xl font-medium whitespace-nowrap">
              {item.name}
            </p>
          </div>
        ))}
      </div>

      {/*------------MAIN CONTENT -> COACHING INFORMATION-----------------*/}
      <div className="w-full max-w-7xl grid grid-cols-3 gap-3 mx-auto">
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>

      {/*------------FOOTER CONTENT-----------------*/}
      <div className="w-full mt-24">
        <Footer />
      </div>
    </div>
  );
};

export default InstitutesOnLocation;
