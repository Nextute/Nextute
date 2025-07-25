import { useState } from "react";
import Card from "./Card";
import HorizontalCard from "./HorizontalCard";

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
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 flex flex-col md:flex-row gap-4 sm:gap-6 items-center justify-center">
        {institutes.slice(0, 2).map((institute) => (
          <HorizontalCard
            key={institute.id}
            id={institute.id}
            name={institute.basic_info?.name || institute.institute_name}
            address={
              institute.contact_details?.headOffice?.address || "Not Available"
            }
            contact={institute.contact}
            image={assets.coaching || institute.basic_info?.logoURL}
            tags={
              ["JEE", "Boards"] ||
              institute.courses?.courses?.map((c) => c.name)
            }
          />
        ))}
      </div>

      {/* Browse Institutes */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#002639] mb-6">
          Browse Institutes
        </h2>

        <div className="flex items-center gap-6 md:gap-8 lg:gap-16 overflow-x-auto scrollbar-hide px-1">
          {course.map((path) => (
            <div
              key={path.id}
              onClick={() => setActivePathId(path.id)}
              className={`flex-shrink-0 rounded-full px-5 sm:px-6 md:px-8 py-2 sm:py-3  cursor-pointer transition-colors duration-300 
            ${
              activePathId === path.id
                ? "bg-[#2D7B67] text-white"
                : "bg-[#F8F7F8] text-[#000000]"
            }`}
            >
              <p className="text-base sm:text-lg  font-medium whitespace-nowrap">
                {path.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full mx-auto px-4 sm:px-6 md:px-8 flex flex-col sm:flex-row gap-6 items-center justify-center mb-10">
        {(activePathId === 1
          ? institutes
          : institutes.filter((institute) =>
            institute.courses?.courses?.some(
              (courseObj) =>
                courseObj.name.toLowerCase() ===
                course.find((c) => c.id === activePathId)?.name.toLowerCase()
            )
          )
        )
          .slice(0, 3)
          .map((institute) => (
            <Card key={institute.id} institute={institute} />
          ))}

      </div>
    </>
  );
};

export default Ad;
