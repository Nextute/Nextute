import { useState } from "react";
import Card from "./Card";

const course = [
  { id: 1, name: "JEE" },
  { id: 2, name: "NEET" },
  { id: 3, name: "GATE" },
  { id: 4, name: "NIFT" },
  { id: 5, name: "SSC CGL" },
  { id: 6, name: "UPSC" },
  { id: 7, name: "NDA" },
  { id: 8, name: "CLAT" },
  { id: 9, name: "CAT" },
  { id: 10, name: "CUET" },
  { id: 11, name: "CDS" },
  { id: 12, name: "AFCAT" },
];

const Ad = () => {
  const [activePathId, setActivePathId] = useState(1);
  return (
    <>
      {/* Advertisement Section */}
      <div className="w-full max-w-7xl px-4 py-8 bg-gray-400 mx-auto rounded-2xl mb-6">
        <p className="text-black text-4xl md:text-6xl lg:text-8xl text-center font-bold">
          Advertisement
        </p>
      </div>

      {/*------ BROWSE INSTITUTES -----*/}
      <div className="w-full max-w-7xl mx-auto py-3">
        <h2 className="text-3xl md:text-4xl font-semibold text-[#002639] mb-6">
          Browse Institutes
        </h2>

        <div className="flex items-center gap-6 md:gap-8 lg:gap-16 overflow-x-auto scrollbar-hide px-1">
          {course.map((path) => (
            <div
              key={path.id}
              onClick={() => setActivePathId(path.id)}
              className={`flex-shrink-0 rounded-full px-9 py-3 cursor-pointer transition-colors duration-300 
            ${
              activePathId === path.id
                ? "bg-[#2D7B67] text-white"
                : "bg-[#F8F7F8] text-[#000000]"
            }`}
            >
              <p className="text-lg md:text-xl font-medium whitespace-nowrap">
                {path.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/*-----------COACHING INFORMATION----------*/}
      <div className="w-full max-w-7xl flex items-center justify-evenly py-3 mx-28 mb-10">
          <Card />
          <Card />
          <Card />
      </div>
      
    </>
  );
};

export default Ad;
