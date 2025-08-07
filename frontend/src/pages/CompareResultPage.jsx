import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ChevronLeft, RefreshCw, Star, CheckCircle } from "lucide-react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { motion, AnimatePresence } from "framer-motion";
import { assets } from "../assets/assets";
import LoadingSpinner from "../components/LoadingSpinner";
import useInstitutes from "../hooks/useInstitutes";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const CompareResultPage = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const { loading, error, setLoading, setError } = useInstitutes();
  const { institutes } = useContext(AppContext);
  const [institute1Data, setInstitute1Data] = useState(null);
  const [institute2Data, setInstitute2Data] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

  // Parse query parameters
  const params = new URLSearchParams(search);
  const institute1 = params.get("institute1");
  const institute2 = params.get("institute2");

  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      setError(null);

      if (!institute1 || !institute2) {
        setError("Please select two institutes to compare.");
        setLoading(false);
        return;
      }

      const data1 = institutes.find((ins) => ins.institute_name === institute1);
      const data2 = institutes.find((ins) => ins.institute_name === institute2);

      if (!data1 || !data2) {
        setError("Selected institutes not found in data.");
        setLoading(false);
        return;
      }

      // Parse JSON strings
      const parsedData1 = {
        ...data1,
        basic_info: JSON.parse(data1.basic_info),
        courses: JSON.parse(data1.courses),
        facilities: JSON.parse(data1.facilities),
        faculty_details: JSON.parse(data1.faculty_details),
        institute_achievements: JSON.parse(data1.institute_achievements),
        student_achievements: JSON.parse(data1.student_achievements),
        contact_details: JSON.parse(data1.contact_details),
      };
      const parsedData2 = {
        ...data2,
        basic_info: JSON.parse(data2.basic_info),
        courses: JSON.parse(data2.courses),
        facilities: JSON.parse(data2.facilities),
        faculty_details: JSON.parse(data2.faculty_details),
        institute_achievements: JSON.parse(data2.institute_achievements),
        student_achievements: JSON.parse(data2.student_achievements),
        contact_details: JSON.parse(data2.contact_details),
      };

      setInstitute1Data(parsedData1);
      setInstitute2Data(parsedData2);

      // Recommendation Logic
      const score1 = calculateScore(parsedData1);
      const score2 = calculateScore(parsedData2);
      const reason =
        score1 > score2
          ? "This institute excels with more courses, a larger faculty, superior facilities, and notable achievements."
          : "This institute stands out due to its extensive offerings, experienced faculty, and strong track record.";
      setRecommendation({
        name:
          score1 > score2
            ? parsedData1.institute_name
            : parsedData2.institute_name,
        id: score1 > score2 ? parsedData1.id : parsedData2.id,
        reason,
        score: Math.max(score1, score2),
        breakdown: {
          courses: Math.max(
            parsedData1.courses?.courses?.length || 0,
            parsedData2.courses?.courses?.length || 0
          ),
          faculty: Math.max(
            JSON.parse(parsedData1.faculty_details?.faculties || "[]").length,
            JSON.parse(parsedData2.faculty_details?.faculties || "[]").length
          ),
          facilities: Math.max(
            Object.values(parsedData1.facilities || {}).filter(
              (value) => value === "Yes"
            ).length,
            Object.values(parsedData2.facilities || {}).filter(
              (value) => value === "Yes"
            ).length
          ),
          achievements: Math.max(
            (parsedData1.institute_achievements?.achievements?.length || 0) +
              (parsedData1.student_achievements?.achievements?.length || 0),
            (parsedData2.institute_achievements?.achievements?.length || 0) +
              (parsedData2.student_achievements?.achievements?.length || 0)
          ),
        },
      });

      setLoading(false);
    };

    loadData();
  }, [institute1, institute2, institutes, setLoading, setError]);

  const calculateScore = (data) => {
    const courseCount = data.courses?.courses?.length || 0;
    const facultyCount = JSON.parse(
      data.faculty_details?.faculties || "[]"
    ).length;
    const facilitiesCount = Object.values(data.facilities || {}).filter(
      (value) => value === "Yes"
    ).length;
    const totalAchievements =
      (data.institute_achievements?.achievements?.length || 0) +
      (data.student_achievements?.achievements?.length || 0);
    const yearsSinceEstablished =
      new Date().getFullYear() -
      (parseInt(data.basic_info?.establishedYear) || 0);

    return (
      courseCount * 2 +
      facultyCount * 1.5 +
      facilitiesCount * 1 +
      totalAchievements * 2 +
      yearsSinceEstablished * 0.5
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !institute1Data || !institute2Data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans">
        <Navbar />
        <div className="w-full max-w-4xl mx-auto px-4 py-12 sm:py-16 flex flex-col items-center text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-red-600">
            {error || "No Matching Institutes Found"}
          </h2>
          <img
            src={assets?.Not_found}
            alt="No institutes found"
            className="w-32 sm:w-48 h-32 sm:h-48 opacity-90"
          />
          <p className="text-base sm:text-lg text-gray-600 max-w-md">
            {error
              ? "An error occurred while fetching institute comparison data. Please try again."
              : "Please select two valid institutes to compare."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/institute-compare")}
              className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-[#2D7A67] text-white rounded-lg hover:bg-[#1A433A] transition-colors duration-200"
              aria-label="Back to institute comparison"
            >
              <ChevronLeft size={16} className="mr-2" />
              Back to Selection
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-[#2D7A67] rounded-lg hover:bg-gray-300 transition-colors duration-200"
              aria-label="Retry loading data"
            >
              <RefreshCw size={16} className="mr-2" />
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Pie chart data
  const chartData = {
    labels: ["Courses", "Faculty", "Facilities", "Achievements"],
    datasets: [
      {
        label: institute1Data.institute_name,
        data: [
          institute1Data.courses?.courses?.length || 0,
          JSON.parse(institute1Data.faculty_details?.faculties || "[]").length,
          Object.values(institute1Data.facilities || {}).filter(
            (value) => value === "Yes"
          ).length,
          (institute1Data.institute_achievements?.achievements?.length || 0) +
            (institute1Data.student_achievements?.achievements?.length || 0),
        ],
        backgroundColor: [
          recommendation?.name === institute1Data.institute_name
            ? "rgba(45, 122, 103, 0.8)"
            : "rgba(45, 122, 103, 0.5)",
          "rgba(45, 122, 103, 0.6)",
          "rgba(45, 122, 103, 0.4)",
          "rgba(45, 122, 103, 0.3)",
        ],
        borderColor: "#2D7A67",
        borderWidth: 2,
        hoverOffset: 20,
      },
      {
        label: institute2Data.institute_name,
        data: [
          institute2Data.courses?.courses?.length || 0,
          JSON.parse(institute2Data.faculty_details?.faculties || "[]").length,
          Object.values(institute2Data.facilities || {}).filter(
            (value) => value === "Yes"
          ).length,
          (institute2Data.institute_achievements?.achievements?.length || 0) +
            (institute2Data.student_achievements?.achievements?.length || 0),
        ],
        backgroundColor: [
          recommendation?.name === institute2Data.institute_name
            ? "rgba(170, 210, 148, 0.8)"
            : "rgba(170, 210, 148, 0.5)",
          "rgba(170, 210, 148, 0.6)",
          "rgba(170, 210, 148, 0.4)",
          "rgba(170, 210, 148, 0.3)",
        ],
        borderColor: "#AAD294",
        borderWidth: 2,
        hoverOffset: 20,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: { size: 12, family: "Inter, sans-serif" },
          padding: 15,
          boxWidth: 30,
        },
      },
      tooltip: {
        backgroundColor: "rgba(45, 122, 103, 0.9)",
        titleFont: { size: 14, family: "Inter, sans-serif" },
        bodyFont: { size: 12, family: "Inter, sans-serif" },
        padding: 10,
        cornerRadius: 6,
      },
      title: {
        display: true,
        text: "Institute Comparison Snapshot",
        font: { size: 18, weight: "bold", family: "Inter, sans-serif" },
        padding: { top: 10, bottom: 20 },
        color: "#1A433A",
      },
    },
    animation: { duration: 1500, easing: "easeOutQuart" },
  };

  // Helper to compare and highlight better metrics
  const highlightBetter = (val1, val2, isHigherBetter = true) => {
    if (isHigherBetter) {
      if (val1 > val2)
        return { class1: "text-[#2D7A67] font-semibold", class2: "" };
      if (val2 > val1)
        return { class1: "", class2: "text-[#2D7A67] font-semibold" };
    } else {
      if (val1 < val2)
        return { class1: "text-[#2D7A67] font-semibold", class2: "" };
      if (val2 < val1)
        return { class1: "", class2: "text-[#2D7A67] font-semibold" };
    }
    return { class1: "", class2: "" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 font-sans">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-[91%]">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <button
            onClick={() => navigate("/institute-compare")}
            className="flex items-center text-[#2D7A67] hover:text-[#1A433A] font-medium transition-colors duration-200 text-sm sm:text-base"
            aria-label="Back to institute comparison"
          >
            <ChevronLeft size={16} className="mr-2" />
            Back to Comparison
          </button>
        </motion.div>

        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3 sm:mb-4">
            {institute1Data.institute_name}{" "}
            <span className="text-[#2D7A67]">vs</span>{" "}
            {institute2Data.institute_name}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-md sm:max-w-2xl mx-auto">
            Discover which institute best suits your needs with our detailed,
            side-by-side comparison.
          </p>
        </motion.section>

        {/* Recommendation Section */}
        {recommendation && (
          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 sm:mb-12 bg-gradient-to-r from-[#2D7A67] to-[#1A433A] text-white rounded-xl shadow-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6"
          >
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-bold flex items-center mb-3 sm:mb-4">
                <Star
                  size={20}
                  className="mr-2 fill-yellow-400 stroke-yellow-400"
                />
                Our Top Recommendation
              </h2>
              <p className="text-sm sm:text-base">
                We recommend{" "}
                <span className="font-bold">{recommendation.name}</span>
              </p>
              <p className="text-xs sm:text-sm mt-2">{recommendation.reason}</p>
              <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm font-medium">Courses</p>
                  <p className="text-sm sm:text-lg font-bold">
                    {recommendation.breakdown.courses}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium">Faculty</p>
                  <p className="text-sm sm:text-lg font-bold">
                    {recommendation.breakdown.faculty}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium">Facilities</p>
                  <p className="text-sm sm:text-lg font-bold">
                    {recommendation.breakdown.facilities}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium">Achievements</p>
                  <p className="text-sm sm:text-lg font-bold">
                    {recommendation.breakdown.achievements}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() =>
                navigate(`/institute/overview/${recommendation.id}`)
              }
              className="bg-white text-[#2D7A67] px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-md text-sm sm:text-base"
              aria-label={`Learn more about ${recommendation.name}`}
            >
              Learn More
            </button>
          </motion.section>
        )}

        {/* Chart Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8 sm:mb-12 bg-white rounded-xl shadow-lg p-4 sm:p-6"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 text-center">
            Performance Snapshot
          </h2>
          <div className="relative h-64 sm:h-80 w-full max-w-md sm:max-w-lg mx-auto">
            <Pie data={chartData} options={chartOptions} />
          </div>
        </motion.section>

        {/* Comparison Section - Desktop (Table) */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="hidden sm:block bg-white rounded-xl shadow-lg p-4 sm:p-6 overflow-hidden"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 text-center">
            Detailed Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="p-3 text-left font-semibold text-gray-700 border-b border-gray-200">
                    Metric
                  </th>
                  <th className="p-3 text-center font-semibold text-gray-700 border-b border-gray-200">
                    <div className="flex items-center justify-center">
                      <img
                        src={
                          institute1Data.basic_info?.logo ||
                          "https://via.placeholder.com/40"
                        }
                        alt={`${institute1Data.institute_name} logo`}
                        className="w-8 h-8 mr-2 rounded-full object-cover"
                      />
                      <span>{institute1Data.institute_name}</span>
                    </div>
                  </th>
                  <th className="p-3 text-center font-semibold text-gray-700 border-b border-gray-200">
                    <div className="flex items-center justify-center">
                      <img
                        src={
                          institute2Data.basic_info?.logo ||
                          "https://via.placeholder.com/40"
                        }
                        alt={`${institute2Data.institute_name} logo`}
                        className="w-8 h-8 mr-2 rounded-full object-cover"
                      />
                      <span>{institute2Data.institute_name}</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                  <td className="p-3 font-medium text-gray-700">Description</td>
                  <td className="p-3 text-center">
                    <span
                      className="line-clamp-2 hover:line-clamp-none cursor-pointer"
                      title={institute1Data.basic_info?.description}
                    >
                      {institute1Data.basic_info?.description || "N/A"}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className="line-clamp-2 hover:line-clamp-none cursor-pointer"
                      title={institute2Data.basic_info?.description}
                    >
                      {institute2Data.basic_info?.description || "N/A"}
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                  <td className="p-3 font-medium text-gray-700">
                    Established Year
                  </td>
                  <td
                    className={`p-3 text-center ${
                      highlightBetter(
                        parseInt(
                          institute1Data.basic_info?.establishedYear || 0
                        ),
                        parseInt(
                          institute2Data.basic_info?.establishedYear || 0
                        )
                      ).class1
                    }`}
                  >
                    {institute1Data.basic_info?.establishedYear || "N/A"}
                  </td>
                  <td
                    className={`p-3 text-center ${
                      highlightBetter(
                        parseInt(
                          institute1Data.basic_info?.establishedYear || 0
                        ),
                        parseInt(
                          institute2Data.basic_info?.establishedYear || 0
                        )
                      ).class2
                    }`}
                  >
                    {institute2Data.basic_info?.establishedYear || "N/A"}
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                  <td className="p-3 font-medium text-gray-700">
                    Exams Targeted
                  </td>
                  <td
                    className={`p-3 text-center ${
                      highlightBetter(
                        institute1Data.basic_info?.exams?.length || 0,
                        institute2Data.basic_info?.exams?.length || 0
                      ).class1
                    }`}
                  >
                    <div className="flex flex-wrap gap-2 justify-center">
                      {institute1Data.basic_info?.exams?.map((exam) => (
                        <span
                          key={exam}
                          className="bg-[#2D7A67] text-white px-2 py-1 rounded-full text-xs"
                        >
                          {exam.toUpperCase()}
                        </span>
                      )) || "N/A"}
                    </div>
                  </td>
                  <td
                    className={`p-3 text-center ${
                      highlightBetter(
                        institute1Data.basic_info?.exams?.length || 0,
                        institute2Data.basic_info?.exams?.length || 0
                      ).class2
                    }`}
                  >
                    <div className="flex flex-wrap gap-2 justify-center">
                      {institute2Data.basic_info?.exams?.map((exam) => (
                        <span
                          key={exam}
                          className="bg-[#AAD294] text-gray-900 px-2 py-1 rounded-full text-xs"
                        >
                          {exam.toUpperCase()}
                        </span>
                      )) || "N/A"}
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                  <td className="p-3 font-medium text-gray-700">
                    Medium of Teaching
                  </td>
                  <td className="p-3 text-center">
                    {institute1Data.basic_info?.medium || "N/A"}
                  </td>
                  <td className="p-3 text-center">
                    {institute2Data.basic_info?.medium || "N/A"}
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                  <td className="p-3 font-medium text-gray-700">Motto</td>
                  <td className="p-3 text-center">
                    {institute1Data.basic_info?.motto || "N/A"}
                  </td>
                  <td className="p-3 text-center">
                    {institute2Data.basic_info?.motto || "N/A"}
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                  <td className="p-3 font-medium text-gray-700">Contact</td>
                  <td className="p-3 text-center">
                    {institute1Data.contact || "N/A"}
                  </td>
                  <td className="p-3 text-center">
                    {institute2Data.contact || "N/A"}
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                  <td className="p-3 font-medium text-gray-700">Head Office</td>
                  <td className="p-3 text-center">
                    {institute1Data.contact_details?.headOffice?.address ||
                      "N/A"}
                  </td>
                  <td className="p-3 text-center">
                    {institute2Data.contact_details?.headOffice?.address ||
                      "N/A"}
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                  <td className="p-3 font-medium text-gray-700">Courses</td>
                  <td
                    className={`p-3 text-center ${
                      highlightBetter(
                        institute1Data.courses?.courses?.length || 0,
                        institute2Data.courses?.courses?.length || 0
                      ).class1
                    }`}
                  >
                    <ul className="list-disc list-inside text-left max-w-md mx-auto text-xs">
                      {institute1Data.courses?.courses?.map((c, index) => (
                        <li key={index}>{c.details}</li>
                      )) || "N/A"}
                    </ul>
                  </td>
                  <td
                    className={`p-3 text-center ${
                      highlightBetter(
                        institute1Data.courses?.courses?.length || 0,
                        institute2Data.courses?.courses?.length || 0
                      ).class2
                    }`}
                  >
                    <ul className="list-disc list-inside text-left max-w-md mx-auto text-xs">
                      {institute2Data.courses?.courses?.map((c, index) => (
                        <li key={index}>{c.details}</li>
                      )) || "N/A"}
                    </ul>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                  <td className="p-3 font-medium text-gray-700">Fee Range</td>
                  <td className="p-3 text-center">
                    <div className="flex flex-col gap-2">
                      {institute1Data.courses?.courses?.map((c, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                        >
                          {c.feeRange}
                        </span>
                      )) || "N/A"}
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex flex-col gap-2">
                      {institute2Data.courses?.courses?.map((c, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                        >
                          {c.feeRange}
                        </span>
                      )) || "N/A"}
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                  <td className="p-3 font-medium text-gray-700">Facilities</td>
                  <td
                    className={`p-3 text-center ${
                      highlightBetter(
                        Object.values(institute1Data.facilities || {}).filter(
                          (value) => value === "Yes"
                        ).length,
                        Object.values(institute2Data.facilities || {}).filter(
                          (value) => value === "Yes"
                        ).length
                      ).class1
                    }`}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(institute1Data.facilities || {})
                        .filter(([_, value]) => value === "Yes")
                        .map(([key]) => (
                          <div
                            key={key}
                            className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-full text-xs"
                          >
                            <CheckCircle size={14} className="text-[#2D7A67]" />
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </div>
                        )) || "N/A"}
                    </div>
                  </td>
                  <td
                    className={`p-3 text-center ${
                      highlightBetter(
                        Object.values(institute1Data.facilities || {}).filter(
                          (value) => value === "Yes"
                        ).length,
                        Object.values(institute2Data.facilities || {}).filter(
                          (value) => value === "Yes"
                        ).length
                      ).class2
                    }`}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(institute2Data.facilities || {})
                        .filter(([_, value]) => value === "Yes")
                        .map(([key]) => (
                          <div
                            key={key}
                            className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-full text-xs"
                          >
                            <CheckCircle size={14} className="text-[#AAD294]" />
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </div>
                        )) || "N/A"}
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                  <td className="p-3 font-medium text-gray-700">
                    Faculty Count
                  </td>
                  <td
                    className={`p-3 text-center ${
                      highlightBetter(
                        JSON.parse(
                          institute1Data.faculty_details?.faculties || "[]"
                        ).length,
                        JSON.parse(
                          institute2Data.faculty_details?.faculties || "[]"
                        ).length
                      ).class1
                    }`}
                  >
                    {JSON.parse(
                      institute1Data.faculty_details?.faculties || "[]"
                    ).length || "N/A"}
                  </td>
                  <td
                    className={`p-3 text-center ${
                      highlightBetter(
                        JSON.parse(
                          institute1Data.faculty_details?.faculties || "[]"
                        ).length,
                        JSON.parse(
                          institute2Data.faculty_details?.faculties || "[]"
                        ).length
                      ).class2
                    }`}
                  >
                    {JSON.parse(
                      institute2Data.faculty_details?.faculties || "[]"
                    ).length || "N/A"}
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                  <td className="p-3 font-medium text-gray-700">
                    Institute Achievements
                  </td>
                  <td
                    className={`p-3 text-center ${
                      highlightBetter(
                        institute1Data.institute_achievements?.achievements
                          ?.length || 0,
                        institute2Data.institute_achievements?.achievements
                          ?.length || 0
                      ).class1
                    }`}
                  >
                    <ul className="list-disc list-inside text-left max-w-md mx-auto text-xs">
                      {institute1Data.institute_achievements?.achievements?.map(
                        (a, index) => <li key={index}>{a.title}</li>
                      ) || "N/A"}
                    </ul>
                  </td>
                  <td
                    className={`p-3 text-center ${
                      highlightBetter(
                        institute1Data.institute_achievements?.achievements
                          ?.length || 0,
                        institute2Data.institute_achievements?.achievements
                          ?.length || 0
                      ).class2
                    }`}
                  >
                    <ul className="list-disc list-inside text-left max-w-md mx-auto text-xs">
                      {institute2Data.institute_achievements?.achievements?.map(
                        (a, index) => <li key={index}>{a.title}</li>
                      ) || "N/A"}
                    </ul>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                  <td className="p-3 font-medium text-gray-700">
                    Student Achievements
                  </td>
                  <td
                    className={`p-3 text-center ${
                      highlightBetter(
                        institute1Data.student_achievements?.achievements
                          ?.length || 0,
                        institute2Data.student_achievements?.achievements
                          ?.length || 0
                      ).class1
                    }`}
                  >
                    <ul className="list-disc list-inside text-left max-w-md mx-auto text-xs">
                      {institute1Data.student_achievements?.achievements?.map(
                        (a, index) => <li key={index}>{a.title}</li>
                      ) || "N/A"}
                    </ul>
                  </td>
                  <td
                    className={`p-3 text-center ${
                      highlightBetter(
                        institute1Data.student_achievements?.achievements
                          ?.length || 0,
                        institute2Data.student_achievements?.achievements
                          ?.length || 0
                      ).class2
                    }`}
                  >
                    <ul className="list-disc list-inside text-left max-w-md mx-auto text-xs">
                      {institute2Data.student_achievements?.achievements?.map(
                        (a, index) => <li key={index}>{a.title}</li>
                      ) || "N/A"}
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Comparison Section - Mobile (Cards) */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="block sm:hidden space-y-4"
        >
          {[
            {
              title: "Description",
              key: "basic_info.description",
              render: (data) => data.basic_info?.description || "N/A",
            },
            {
              title: "Established Year",
              key: "basic_info.establishedYear",
              render: (data) => data.basic_info?.establishedYear || "N/A",
              compare: (a, b) => parseInt(a || 0) > parseInt(b || 0),
            },
            {
              title: "Exams Targeted",
              key: "basic_info.exams",
              render: (data) => (
                <div className="flex flex-wrap gap-2">
                  {data.basic_info?.exams?.map((exam) => (
                    <span
                      key={exam}
                      className={`px-2 py-1 rounded-full text-xs ${
                        data === institute1Data
                          ? "bg-[#2D7A67] text-white"
                          : "bg-[#AAD294] text-gray-900"
                      }`}
                    >
                      {exam.toUpperCase()}
                    </span>
                  )) || "N/A"}
                </div>
              ),
              compare: (a, b) => (a?.length || 0) > (b?.length || 0),
            },
            {
              title: "Medium of Teaching",
              key: "basic_info.medium",
              render: (data) => data.basic_info?.medium || "N/A",
            },
            {
              title: "Motto",
              key: "basic_info.motto",
              render: (data) => data.basic_info?.motto || "N/A",
            },
            {
              title: "Contact",
              key: "contact",
              render: (data) => data.contact || "N/A",
            },
            {
              title: "Head Office",
              key: "contact_details.headOffice.address",
              render: (data) =>
                data.contact_details?.headOffice?.address || "N/A",
            },
            {
              title: "Courses",
              key: "courses.courses",
              render: (data) => (
                <ul className="list-disc list-inside text-xs">
                  {data.courses?.courses?.map((c, index) => (
                    <li key={index}>{c.details}</li>
                  )) || "N/A"}
                </ul>
              ),
              compare: (a, b) => (a?.length || 0) > (b?.length || 0),
            },
            {
              title: "Fee Range",
              key: "courses.courses",
              render: (data) => (
                <div className="flex flex-col gap-2">
                  {data.courses?.courses?.map((c, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                    >
                      {c.feeRange}
                    </span>
                  )) || "N/A"}
                </div>
              ),
            },
            {
              title: "Facilities",
              key: "facilities",
              render: (data) => (
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(data.facilities || {})
                    .filter(([_, value]) => value === "Yes")
                    .map(([key]) => (
                      <div
                        key={key}
                        className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-full text-xs"
                      >
                        <CheckCircle
                          size={14}
                          className={
                            data === institute1Data
                              ? "text-[#2D7A67]"
                              : "text-[#AAD294]"
                          }
                        />
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </div>
                    )) || "N/A"}
                </div>
              ),
              compare: (a, b) =>
                Object.values(a || {}).filter((v) => v === "Yes").length >
                Object.values(b || {}).filter((v) => v === "Yes").length,
            },
            {
              title: "Faculty Count",
              key: "faculty_details.faculties",
              render: (data) =>
                JSON.parse(data.faculty_details?.faculties || "[]").length ||
                "N/A",
              compare: (a, b) =>
                JSON.parse(a || "[]").length > JSON.parse(b || "[]").length,
            },
            {
              title: "Institute Achievements",
              key: "institute_achievements.achievements",
              render: (data) => (
                <ul className="list-disc list-inside text-xs">
                  {data.institute_achievements?.achievements?.map(
                    (a, index) => <li key={index}>{a.title}</li>
                  ) || "N/A"}
                </ul>
              ),
              compare: (a, b) => (a?.length || 0) > (b?.length || 0),
            },
            {
              title: "Student Achievements",
              key: "student_achievements.achievements",
              render: (data) => (
                <ul className="list-disc list-inside text-xs">
                  {data.student_achievements?.achievements?.map((a, index) => (
                    <li key={index}>{a.title}</li>
                  )) || "N/A"}
                </ul>
              ),
              compare: (a, b) => (a?.length || 0) > (b?.length || 0),
            },
          ].map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              className="bg-white rounded-xl shadow-md p-4"
            >
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                {metric.title}
              </h3>
              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600">
                      {institute1Data.institute_name}
                    </span>
                    {metric.compare &&
                      highlightBetter(
                        metric.key
                          .split(".")
                          .reduce(
                            (o, k) => (o ? o[k] : undefined),
                            institute1Data
                          ),
                        metric.key
                          .split(".")
                          .reduce(
                            (o, k) => (o ? o[k] : undefined),
                            institute2Data
                          )
                      ).class1 && (
                        <CheckCircle size={14} className="text-[#2D7A67]" />
                      )}
                  </div>
                  <div
                    className={`text-xs ${
                      highlightBetter(
                        metric.key
                          .split(".")
                          .reduce(
                            (o, k) => (o ? o[k] : undefined),
                            institute1Data
                          ),
                        metric.key
                          .split(".")
                          .reduce(
                            (o, k) => (o ? o[k] : undefined),
                            institute2Data
                          )
                      ).class1
                    }`}
                  >
                    {metric.render(institute1Data)}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600">
                      {institute2Data.institute_name}
                    </span>
                    {metric.compare &&
                      highlightBetter(
                        metric.key
                          .split(".")
                          .reduce(
                            (o, k) => (o ? o[k] : undefined),
                            institute1Data
                          ),
                        metric.key
                          .split(".")
                          .reduce(
                            (o, k) => (o ? o[k] : undefined),
                            institute2Data
                          )
                      ).class2 && (
                        <CheckCircle size={14} className="text-[#2D7A67]" />
                      )}
                  </div>
                  <div
                    className={`text-xs ${
                      highlightBetter(
                        metric.key
                          .split(".")
                          .reduce(
                            (o, k) => (o ? o[k] : undefined),
                            institute1Data
                          ),
                        metric.key
                          .split(".")
                          .reduce(
                            (o, k) => (o ? o[k] : undefined),
                            institute2Data
                          )
                      ).class2
                    }`}
                  >
                    {metric.render(institute2Data)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.section>
      </main>
      <Footer />
    </div>
  );
};

export default CompareResultPage;
