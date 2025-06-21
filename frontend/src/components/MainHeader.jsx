import { useRef, useEffect, useState } from "react";

const MainHeader = () => {
  const tabs = [
    "Basic Information",
    "Contact Details",
    "Course Offered",
    "Faculties Details",
    "Achievements",
    "Facilities",
    "Media & Gallery",
    "Social Media",
  ];

  const [activeTab, setActiveTab] = useState(0);
  const containerRef = useRef(null);
  const circleRefs = useRef([]);
  const [circleCenters, setCircleCenters] = useState([]);

  useEffect(() => {
    const updatePositions = () => {
      if (!containerRef.current) return;

      const parentRect = containerRef.current.getBoundingClientRect();
      const positions = circleRefs.current.map((ref) => {
        if (!ref) return 0;
        const rect = ref.getBoundingClientRect();
        return rect.left - parentRect.left + rect.width / 2;
      });
      setCircleCenters(positions);
    };

    updatePositions();
    window.addEventListener("resize", updatePositions);
    return () => window.removeEventListener("resize", updatePositions);
  }, [activeTab]);

  const lineStart = circleCenters[0] || 0;
  const lineEnd = circleCenters[activeTab] || 0;
  const lineLeft = Math.min(lineStart, lineEnd);
  const lineWidth = Math.abs(lineEnd - lineStart);

  return (
    <div className="w-full bg-white py-4 sm:py-6 md:py-8">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 px-4 sm:px-6 md:px-8 mb-4 sm:mb-6">
        {tabs[activeTab]}
      </h1>

      <div
        className="relative w-full max-w-7xl mx-auto flex flex-col sm:flex-row flex-wrap justify-start sm:justify-between items-start sm:items-center px-4 sm:px-6 md:px-8 py-6 sm:py-8 bg-gray-50 rounded-2xl shadow-md"
        ref={containerRef}
      >
        {/* Progress Line */}
        <div
          className="absolute h-1 bg-teal-600 z-0 transition-all duration-300 ease-in-out sm:h-1.5"
          style={{
            top: "calc(100% - 12px)", 
            left: `${lineLeft}px`,
            width: `${lineWidth}px`,
          }}
        />

        {/* Circles + Labels (Radio Style) */}
        {tabs.map((tab, index) => (
          <label
            key={index}
            className="flex flex-col justify-start items-start sm:items-center sm:text-center cursor-pointer w-32 sm:w-auto sm:flex-1 mb-6 sm:mb-0 z-10"
          >
            <input
              type="radio"
              name="progress"
              className="hidden"
              checked={activeTab === index}
              onChange={() => setActiveTab(index)}
            />
            <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-700 hover:text-teal-600 transition-colors duration-200 whitespace-nowrap">
              {tab}
            </span>
            <div
              ref={(el) => (circleRefs.current[index] = el)}
              className={`h-6 w-6 sm:h-7 sm:w-7 mt-2 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                index <= activeTab
                  ? "border-teal-600 bg-teal-600"
                  : "border-gray-300 bg-white"
              }`}
            >
              <div
                className={`h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full ${
                  index <= activeTab ? "bg-white" : "bg-gray-300"
                }`}
              />
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default MainHeader;
