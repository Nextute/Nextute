import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import LoadingSpinner from "../components/LoadingSpinner";
import { assets } from "../assets/assets";
import useInstitutes from "../hooks/useInstitutes";

function parseJSONSafe(str) {
  try {
    return typeof str === "string" ? JSON.parse(str) : str;
  } catch {
    return {};
  }
}

const InstituteOnLocation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q")?.toLowerCase() || "";
  const selectedCity = searchParams.get("city")?.toLowerCase() || "";
  const [searchInput, setSearchInput] = useState(query);

  const { institutes: institutesData, loading, error } = useInstitutes();

  // Filter states
  const [courseType, setCourseType] = useState("All");
  const [feeRange, setFeeRange] = useState("Any");
  const [rating, setRating] = useState("Any");
  const [batchTiming, setBatchTiming] = useState("Any");
  const [language, setLanguage] = useState("Any");

  // Parse and memoize institute data
  const parsedInstitutes = useMemo(() => {
    return institutesData.map((institute) => ({
      ...institute,
      basic_info: parseJSONSafe(institute.basic_info),
      contact_details: parseJSONSafe(institute.contact_details),
      courses: parseJSONSafe(institute.courses),
    }));
  }, [institutesData]);

  // Memoize filtered data
  const filteredInstitutes = useMemo(() => {
    return parsedInstitutes.filter((institute) => {
      const name = institute.basic_info?.institute_name?.toLowerCase() || "";
      const address =
        institute.contact_details?.headOffice?.address?.toLowerCase() || "";
      const city =
        institute.contact_details?.headOffice?.city?.toLowerCase() || "";
      const exams = Array.isArray(institute.basic_info?.exams)
        ? institute.basic_info.exams.map((exam) => exam.toLowerCase())
        : [];
      const courses = Array.isArray(institute.courses?.courses)
        ? institute.courses.courses
        : [];
      const instRating = parseFloat(institute.rating) || 0;
      const instLanguage =
        courses.find((course) => course.medium)?.medium?.toLowerCase() || "";

      // Query match: Check name, address, city, or exams
      const matchesQuery =
        !query ||
        name.includes(query) ||
        address.includes(query) ||
        city.includes(query) ||
        exams.some((exam) => exam.includes(query));

      // Course type filter: Check basic_info.exams
      const matchesCourse =
        courseType === "All" || exams.includes(courseType.toLowerCase());

      // Fee range filter: Check courses.courses[].feeRange
      const matchesFee =
        feeRange === "Any" ||
        courses.some((course) => {
          const feeStr = course.feeRange?.toLowerCase() || "";
          return (
            (feeRange === "Below ₹20,000" &&
              (feeStr.includes("2k-5k") || feeStr.includes("5k-15k"))) ||
            (feeRange === "₹20,000 - ₹50,000" && feeStr.includes("15k-50k")) ||
            (feeRange === "Above ₹50,000" && feeStr.includes("50k+"))
          );
        });

      // Rating filter
      const matchesRating =
        rating === "Any" || instRating >= parseFloat(rating);

      // Batch timing filter (placeholder, as data not available)
      const matchesTiming = batchTiming === "Any";

      // Language filter
      const matchesLang =
        language === "Any" || instLanguage.includes(language.toLowerCase());

      // City filter
      const matchesCity = !selectedCity || city.includes(selectedCity);

      return (
        matchesQuery &&
        matchesCourse &&
        matchesFee &&
        matchesRating &&
        matchesTiming &&
        matchesLang &&
        matchesCity
      );
    });
  }, [
    parsedInstitutes,
    query,
    selectedCity,
    courseType,
    feeRange,
    rating,
    batchTiming,
    language,
  ]);

  const handleClearFilters = () => {
    setCourseType("All");
    setFeeRange("Any");
    setRating("Any");
    setBatchTiming("Any");
    setLanguage("Any");
    setSearchInput("");
    navigate(
      `/institutes-on-location${selectedCity ? `?city=${selectedCity}` : ""}`
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(
        `/institutes-on-location?q=${encodeURIComponent(searchInput.trim())}${
          selectedCity ? `&city=${selectedCity}` : ""
        }`
      );
    } else {
      navigate(
        `/institutes-on-location${selectedCity ? `?city=${selectedCity}` : ""}`
      );
    }
  };

  // Sync search input with query param on page load or query change
  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <>
      <Navbar />

      <motion.div
        className="w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/80 min-h-screen"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header and Search Bar */}
        <motion.div className="mb-10 sm:mb-12 md:mb-16" variants={itemVariants}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">
                {selectedCity ? (
                  <>
                    Institutes in{" "}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
                      {selectedCity.charAt(0).toUpperCase() +
                        selectedCity.slice(1)}
                    </span>
                  </>
                ) : query ? (
                  <>
                    Results for{" "}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
                      "{query.toUpperCase()}"
                    </span>
                  </>
                ) : (
                  <>
                    Find Your{" "}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
                      Perfect Institute
                    </span>
                  </>
                )}
              </h1>
              <p className="mt-3 text-base sm:text-lg md:text-xl text-gray-600 max-w-xl">
                Discover top coaching institutes tailored to your goals with
                advanced filters and search.
              </p>
            </div>
            <form
              onSubmit={handleSearch}
              className="relative w-full sm:w-80 md:w-96"
            >
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search institutes, courses, or locations..."
                className="w-full py-3 pl-12 pr-4 text-sm sm:text-base bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-300"
                aria-label="Search institutes"
              />
              <button
                type="submit"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition duration-200"
                aria-label="Submit search"
              >
                <Search className="w-5 h-5" />
              </button>
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    navigate(
                      `/institutes-on-location${
                        selectedCity ? `?city=${selectedCity}` : ""
                      }`
                    );
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition duration-200"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </form>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="flex flex-wrap gap-3 sm:gap-4 lg:gap-5 mb-8 sm:mb-10 md:mb-12"
          variants={itemVariants}
        >
          {[
            {
              label: "Course Type",
              value: courseType,
              onChange: setCourseType,
              options: [
                "All",
                "JEE",
                "NEET",
                "GATE",
                "NIFT",
                "SSC CGL",
                "UPSC",
                "NDA",
                "CLAT",
                "CAT",
                "CUET",
                "CDS",
                "AFCAT",
              ],
            },
            {
              label: "Fee Range",
              value: feeRange,
              onChange: setFeeRange,
              options: [
                "Any",
                "Below ₹20,000",
                "₹20,000 - ₹50,000",
                "Above ₹50,000",
              ],
            },
            {
              label: "Rating",
              value: rating,
              onChange: setRating,
              options: ["Any", "4.5", "4.0", "3.5"],
            },
            {
              label: "Batch Timing",
              value: batchTiming,
              onChange: setBatchTiming,
              options: ["Any", "Morning", "Afternoon", "Evening"],
              disabled: true,
            },
            {
              label: "Language",
              value: language,
              onChange: setLanguage,
              options: ["Any", "English", "Hindi", "Bilingual"],
            },
          ].map((filter, idx) => (
            <div
              key={idx}
              className="flex flex-col min-w-[7rem] sm:min-w-[8.5rem] md:min-w-[10rem]"
            >
              <label className="text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 tracking-wide">
                {filter.label}
              </label>
              <select
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm sm:text-base bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                disabled={filter.disabled}
                aria-label={`Filter by ${filter.label}`}
              >
                {filter.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* Clear Filters */}
          <div className="flex items-end">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClearFilters}
              className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold px-5 sm:px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-300 text-sm sm:text-base"
            >
              Clear All
            </motion.button>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <LoadingSpinner />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              className="text-center py-16 text-red-500 text-base sm:text-lg md:text-xl font-semibold bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {error}
            </motion.div>
          ) : filteredInstitutes.length === 0 ? (
            <motion.div
              key="no-results"
              className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-8 sm:p-10 md:p-12 bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <img
                src={
                  assets.Not_found ||
                  "https://via.placeholder.com/200?text=No+Image"
                }
                alt="No institutes found"
                className="w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 mb-6 opacity-90"
                loading="lazy"
              />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-center">
                No Institutes Found
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 font-normal text-center max-w-lg mb-6">
                We couldn't find any institutes matching your criteria for{" "}
                <span className="font-semibold text-emerald-600">
                  {selectedCity
                    ? selectedCity.charAt(0).toUpperCase() +
                      selectedCity.slice(1)
                    : query || "your search"}
                </span>
                . Try different filters or search terms.
              </p>
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearFilters}
                className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-300 text-sm sm:text-base"
              >
                Reset Filters
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4 sm:gap-6 lg:gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {filteredInstitutes.map((institute) => (
                <Card key={institute.id} institute={institute} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <Footer />
    </>
  );
};

export default InstituteOnLocation;
