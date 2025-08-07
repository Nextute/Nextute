import { useState, useContext } from "react";
import Card from "./Card";
import HorizontalCard from "./HorizontalCard";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import useInstitutes from "../hooks/useInstitutes";
import LoadingSpinner from "./LoadingSpinner";

const course = [
  { id: 1, name: "ALL" },
  { id: 2, name: "JEE" },
  { id: 3, name: "NEET" },
  { id: 4, name: "GATE" },
  { id: 5, name: "NIFT" },
  { id: 6, name: "SSC" },
  { id: 7, name: "UPSC" },
  { id: 8, name: "NDA" },
  { id: 9, name: "CLAT" },
  { id: 10, name: "CAT" },
  { id: 11, name: "CUET" },
  { id: 12, name: "CDS" },
  { id: 13, name: "AFCAT" },
];

function parseJSONSafe(str) {
  try {
    return typeof str === "string" ? JSON.parse(str) : str;
  } catch {
    return {};
  }
}

const Ad = () => {
  const [activePathId, setActivePathId] = useState(1);
  const { VITE_BACKEND_BASE_URL } = useContext(AppContext);
  const { institutes, loading, error } = useInstitutes(VITE_BACKEND_BASE_URL);

  const parsedInstitutes = institutes.map((institute) => ({
    ...institute,
    basic_info: parseJSONSafe(institute.basic_info),
    contact_details: parseJSONSafe(institute.contact_details),
    courses: parseJSONSafe(institute.courses),
  }));

  const filteredInstitutes =
    activePathId === 1
      ? parsedInstitutes
      : parsedInstitutes.filter((institute) => {
          const targetCourse = course.find((c) => c.id === activePathId);
          if (!targetCourse?.name) return false;

          const exams = Array.isArray(institute.basic_info?.exams)
            ? institute.basic_info.exams.map((exam) => exam.toLowerCase())
            : [];
          return exams.includes(targetCourse.name.toLowerCase());
        });

  const finalInstitutes = [...filteredInstitutes]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="text-center py-8 text-red-500 text-base sm:text-lg">
        {error}
      </div>
    );

  return (
    <>
      {/* Advertisement Section */}
      <div className="w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col md:flex-row gap-4 sm:gap-6 lg:gap-8 items-center justify-center">
        {[...parsedInstitutes]
          .sort(() => Math.random() - 0.5)
          .slice(0, 2)
          .map((institute) => (
            <HorizontalCard
              key={institute.id}
              id={institute.id}
              name={
                institute.basic_info?.institute_name ||
                institute.institute_name ||
                "Unnamed Institute"
              }
              address={
                institute.contact_details?.headOffice?.address ||
                "Not Available"
              }
              contact={institute.contact || "+91 91234 56789"}
              image={institute.basic_info?.logo || assets.coaching}
              tags={
                Array.isArray(institute.basic_info?.exams)
                  ? institute.basic_info.exams
                      .map((exam) => exam?.trim()?.toUpperCase())
                      .filter(Boolean)
                  : ["JEE", "BOARDS"]
              }
            />
          ))}
      </div>

      {/* Browse Institutes */}
      <div className="w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-[#002639] mb-4 sm:mb-6">
          Browse Institutes
        </h2>

        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-2">
          {course.map((path) => (
            <button
              key={path.id}
              onClick={() => setActivePathId(path.id)}
              className={`flex-shrink-0 rounded-full px-4 sm:px-5 lg:px-6 py-1.5 sm:py-2 text-sm sm:text-base font-medium cursor-pointer transition-colors duration-300 whitespace-nowrap
                ${
                  activePathId === path.id
                    ? "bg-[#2D7B67] text-white"
                    : "bg-[#F8F7F8] text-[#002639] hover:bg-emerald-100"
                }`}
            >
              {path.name}
            </button>
          ))}
        </div>
      </div>

      {/* Institutes Grid */}
      <div className="w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 justify-items-center mb-10">
        {finalInstitutes.length > 0 ? (
          finalInstitutes.map((institute) => (
            <Card key={institute.id} institute={institute} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-6 sm:p-8 bg-teal-50 rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
            <img
              src={
                assets.Not_found ||
                "https://via.placeholder.com/200?text=No+Image"
              }
              alt="No institutes found"
              className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mb-4 opacity-90"
              loading="lazy"
            />
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-red-500 mb-2 text-center">
              No Matching Institutes Found
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 font-normal text-center max-w-md">
              Looks like there are no institutes currently offering this course.
              Try exploring other courses or check back later.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Ad;
