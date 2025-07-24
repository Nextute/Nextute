import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import axios from "axios";

const SearchPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q")?.toLowerCase() || "";
  const selectedCity = searchParams.get("city")?.toLowerCase() || "";

  const [institutes, setInstitutes] = useState([]);
  const [filteredInstitutes, setFilteredInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter states
  const [courseType, setCourseType] = useState("All");
  const [feeRange, setFeeRange] = useState("Any");
  const [rating, setRating] = useState("Any");
  const [batchTiming, setBatchTiming] = useState("Any");
  const [language, setLanguage] = useState("Any");

  const BACKEND_URL = "http://localhost:8080/api/institutes/all-institutes";

  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        const response = await axios.get(BACKEND_URL);
        const allInstitutes = response.data?.data || [];
        setInstitutes(allInstitutes);
        setFilteredInstitutes(applyAllFilters(allInstitutes)); // initial filter with query
      } catch (err) {
        console.error("Failed to fetch institutes:", err);
        setError("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutes();
  }, []);

  useEffect(() => {
    if (!loading && institutes.length > 0) {
      setFilteredInstitutes(applyAllFilters(institutes));
    }
  }, [courseType, feeRange, rating, batchTiming, language, selectedCity, institutes, loading]);



  const applyAllFilters = (data) => {
    return data.filter((institute) => {
      const name = institute.basic_info?.name?.toLowerCase() || "";
      const address =
        institute.contact_details?.headOffice?.address?.toLowerCase() || "";
      const tags =
        institute.courses?.courses?.map((c) => c.name?.toLowerCase()) || [];
      const fee = parseInt(institute.fee) || 0;
      const instRating = parseFloat(institute.rating) || 0;
      const instTiming = institute.batch_timing?.toLowerCase() || "";
      const instLanguage = institute.language?.toLowerCase() || "";

      const matchesQuery =
        name.includes(query) ||
        address.includes(query) ||
        tags.join(" ").includes(query);

      const matchesCourse =
        courseType === "All" || tags.includes(courseType.toLowerCase());

      const matchesFee =
        feeRange === "Any" ||
        (feeRange === "Below ₹20,000" && fee < 20000) ||
        (feeRange === "₹20,000 - ₹50,000" && fee >= 20000 && fee <= 50000) ||
        (feeRange === "Above ₹50,000" && fee > 50000);

      const matchesRating =
        rating === "Any" || instRating >= parseFloat(rating);

      const matchesTiming =
        batchTiming === "Any" || instTiming.includes(batchTiming.toLowerCase());

      const matchesLang =
        language === "Any" || instLanguage.includes(language.toLowerCase());

      const matchesCity =
        !selectedCity || address.includes(selectedCity);

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
  };

  const handleClearFilters = () => {
    setCourseType("All");
    setFeeRange("Any");
    setRating("Any");
    setBatchTiming("Any");
    setLanguage("Any");
    setFilteredInstitutes(applyAllFilters(institutes));
  };

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header with Filter Icon */}
        <div className="flex items-center justify-between mb-10 md:mb-20">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#002639]">
            {selectedCity ? (
              <>Popular tutorials in: <span className="text-[#2D7B67]">"{selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}"</span></>
            ) : query ? (
              <>Popular tutorials for: <span className="text-[#2D7B67]">"{query}"</span></>
            ) : (
              "All Institutes"
            )}
          </h1>
        </div>

        {/* Filter Popup */}
        <div className="flex flex-wrap gap-4 mb-10 md:mb-20 items-end">
          {/* Course Type */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Course Type</label>
            <select
              className="border border-gray-300 rounded-md px-3 py-2"
              value={courseType}
              onChange={(e) => setCourseType(e.target.value)}
            >
              <option>All</option>
              <option>JEE</option>
              <option>NEET</option>
              <option>GATE</option>
              <option>NIFT</option>
              <option>SSC CGL</option>
              <option>UPSC</option>
              <option>NDA</option>
              <option>CLAT</option>
              <option>CAT</option>
              <option>CUET</option>
              <option>CDS</option>
              <option>AFCAT</option>
            </select>
          </div>

          {/* Fee Range */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Fee Range</label>
            <select
              className="border border-gray-300 rounded-md px-3 py-2"
              value={feeRange}
              onChange={(e) => setFeeRange(e.target.value)}
            >
              <option>Any</option>
              <option>Below ₹20,000</option>
              <option>₹20,000 - ₹50,000</option>
              <option>Above ₹50,000</option>
            </select>
          </div>

          {/* Rating */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Rating</label>
            <select
              className="border border-gray-300 rounded-md px-3 py-2"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option>Any</option>
              <option>4.5</option>
              <option>4.0</option>
              <option>3.5</option>
            </select>
          </div>

          {/* Batch Timing */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Batch Timing</label>
            <select
              className="border border-gray-300 rounded-md px-3 py-2"
              value={batchTiming}
              onChange={(e) => setBatchTiming(e.target.value)}
            >
              <option>Any</option>
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Evening</option>
            </select>
          </div>

          {/* Language */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Language</label>
            <select
              className="border border-gray-300 rounded-md px-3 py-2"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option>Any</option>
              <option>English</option>
              <option>Hindi</option>
              <option>Bilingual</option>
            </select>
          </div>

          <div className="flex-grow"></div>
          <div className="flex items-end ml-auto">
            <button
              onClick={handleClearFilters}
              className="bg-red-500 text-white font-medium px-5 py-1 rounded-md hover:bg-red-600 mt-5"
            >
              Clear Filters
            </button>
          </div>

        </div>


        {/* Result List */}
        {loading ? (
          <p className="text-gray-500">Loading institutes...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredInstitutes.length === 0 ? (
              <p className="text-gray-600">No results found for "{selectedCity}".</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInstitutes.map((institute) => (
              <Card key={institute.id} institute={institute} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default SearchPage;

// import React, { useEffect, useState, useRef } from "react";
// import { useLocation } from "react-router-dom";
// import { FaLocationDot } from "react-icons/fa6";
// import { Search } from "lucide-react";
// import Navbar from "../components/Navbar";
// import Card from "../components/Card";
// import Footer from "../components/Footer";
// import { FaTimes } from "react-icons/fa";
// import axios from "axios";
// import { useContext } from "react";
// import { AppContext } from "../context/AppContext";

// const filters = {
//   distance: [
//     { id: "1-3km", name: "1-3 km" },
//     { id: "3-5km", name: "3-5 km" },
//     { id: "nearby", name: "Nearby" },
//     { id: "all", name: "All" },
//   ],
//   courseType: [
//     { id: "JEE", name: "JEE" },
//     { id: "NEET", name: "NEET" },
//     { id: "UPSC", name: "UPSC" },
//     { id: "CAT", name: "CAT" },
//     { id: "Boards", name: "Class 9-12 (Boards)" },
//     { id: "Coding", name: "Coding/Computer Courses" },
//     { id: "all", name: "All" },
//   ],
//   rating: [
//     { id: "4+", name: "4+ (Excellent)" },
//     { id: "3+", name: "3+ (Good)" },
//     { id: "all", name: "All" },
//   ],
//   modeOfTeaching: [
//     { id: "online", name: "Online" },
//     { id: "offline", name: "Offline" },
//     { id: "hybrid", name: "Hybrid" },
//     { id: "all", name: "All" },
//   ],
// };

// const InstitutesOnLocation = () => {
//   const [activeFilters, setActiveFilters] = useState({
//     distance: "all",
//     courseType: "all",
//     rating: "all",
//     modeOfTeaching: "all",
//   });
//   const [institutes, setInstitutes] = useState([]); // Original API data
//   const [filteredInstitutes, setFilteredInstitutes] = useState([]); // Filtered data
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [locationQuery, setLocationQuery] = useState("Hajipur");
//   const [showFilterDropdown, setShowFilterDropdown] = useState(null);
//   const location = useLocation();
//   const filterRef = useRef(null);
//   const { VITE_BACKEND_BASE_URL } = useContext(AppContext);

//   // Fetch institutes from backend using axios
//   useEffect(() => {
//     const fetchInstitutes = async () => {
//       setLoading(true);
//       try {
//         console.log("Fetching institutes from /api/institutes...");
//         const response = await axios.get("http://localhost:8080/api/institutes/all-institutes");

//         console.log("Response status:", response.status);
//         console.log("Response data:", response.data);

//         if (response.status !== 200) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         if (!Array.isArray(response.data.data)) {
//           console.error("Expected response.data.data to be an array but got:", response.data);
//           throw new Error("Invalid response format: Expected 'data' to be an array inside the response");
//         }


//         const parsedData = response.data.data.map((institute) => {
//           try {
//             return {
//               ...institute,
//               courses: typeof institute.courses === "string"
//                 ? JSON.parse(institute.courses)
//                 : institute.courses || [],
//               basic_info: typeof institute.basic_info === "string"
//                 ? JSON.parse(institute.basic_info)
//                 : institute.basic_info || {},
//               contact_details: typeof institute.contact_details === "string"
//                 ? JSON.parse(institute.contact_details)
//                 : institute.contact_details || {},
//             };
//           } catch (err) {
//             console.error(`Error parsing JSON for ${institute.institute_id}`, err);
//             return institute;
//           }
//         });

//         setInstitutes(parsedData);
//         setFilteredInstitutes(parsedData);
//         setError(null);
//         console.log("Institutes set successfully:", parsedData);
//       } catch (err) {
//         console.error("Fetch institutes error:", {
//           message: err.message,
//           response: err.response
//             ? {
//                 status: err.response.status,
//                 data: err.response.data,
//               }
//             : "No response data",
//         });
//         setError("Failed to load institutes. Please try again later.");
//       } finally {
//         setLoading(false);
//         console.log("Fetch institutes complete, loading:", false);
//       }
//     };
//     fetchInstitutes();
//   }, []);

//   // Extract query from URL and set location
//   useEffect(() => {
//     const query = new URLSearchParams(location.search).get("query") || "";
//     console.log("URL query:", query);
//     setSearchQuery(query);
//     setLocationQuery(query || "Hajipur");
//   }, [location.search]);

//   // Filter logic
//   useEffect(() => {
//     console.log("Applying filters with:", { searchQuery, activeFilters });
//     let filtered = [...institutes];

//     if (searchQuery) {
//       filtered = filtered.filter((institute) => {
//         const matches =
//           institute.institute_name
//             ?.toLowerCase()
//             .includes(searchQuery.toLowerCase()) ||
//           institute.contact_details?.address
//             ?.toLowerCase()
//             .includes(searchQuery.toLowerCase()) ||
//           institute.courses?.some((course) =>
//             course.toLowerCase().includes(searchQuery.toLowerCase())
//           );
//         console.log(
//           `Institute ${institute.institute_name || "Unknown"} matches search:`,
//           matches
//         );
//         return matches;
//       });
//     }

//     if (activeFilters.distance !== "all") {
//       if (activeFilters.distance === "nearby") {
//         filtered = filtered.filter((institute) => {
//           const matches = institute.basic_info?.distance <= 5;
//           console.log(
//             `Institute ${
//               institute.institute_name || "Unknown"
//             } matches nearby:`,
//             matches
//           );
//           return matches;
//         });
//       } else if (activeFilters.distance === "1-3km") {
//         filtered = filtered.filter((institute) => {
//           const matches =
//             institute.basic_info?.distance >= 1 &&
//             institute.basic_info?.distance <= 3;
//           console.log(
//             `Institute ${institute.institute_name || "Unknown"} matches 1-3km:`,
//             matches
//           );
//           return matches;
//         });
//       } else if (activeFilters.distance === "3-5km") {
//         filtered = filtered.filter((institute) => {
//           const matches =
//             institute.basic_info?.distance > 3 &&
//             institute.basic_info?.distance <= 5;
//           console.log(
//             `Institute ${institute.institute_name || "Unknown"} matches 3-5km:`,
//             matches
//           );
//           return matches;
//         });
//       }
//     }

//     if (activeFilters.courseType !== "all") {
//       filtered = filtered.filter((institute) => {
//         const matches = institute.courses?.includes(activeFilters.courseType);
//         console.log(
//           `Institute ${
//             institute.institute_name || "Unknown"
//           } matches courseType ${activeFilters.courseType}:`,
//           matches
//         );
//         return matches;
//       });
//     }

//     if (activeFilters.rating !== "all") {
//       if (activeFilters.rating === "4+") {
//         filtered = filtered.filter((institute) => {
//           const matches = institute.basic_info?.rating >= 4;
//           console.log(
//             `Institute ${
//               institute.institute_name || "Unknown"
//             } matches rating 4+:`,
//             matches
//           );
//           return matches;
//         });
//       } else if (activeFilters.rating === "3+") {
//         filtered = filtered.filter((institute) => {
//           const matches = institute.basic_info?.rating >= 3;
//           console.log(
//             `Institute ${
//               institute.institute_name || "Unknown"
//             } matches rating 3+:`,
//             matches
//           );
//           return matches;
//         });
//       }
//     }

//     if (activeFilters.modeOfTeaching !== "all") {
//       filtered = filtered.filter((institute) => {
//         const matches =
//           institute.basic_info?.modeOfTeaching === activeFilters.modeOfTeaching;
//         console.log(
//           `Institute ${
//             institute.institute_name || "Unknown"
//           } matches modeOfTeaching ${activeFilters.modeOfTeaching}:`,
//           matches
//         );
//         return matches;
//       });
//     }

//     setFilteredInstitutes(filtered);
//     console.log("Filtered institutes:", filtered);
//   }, [searchQuery, activeFilters, institutes]);

//   const handleFilterChange = (category, id) => {
//     console.log(`Changing filter: ${category} to ${id}`);
//     setActiveFilters((prev) => ({
//       ...prev,
//       [category]: id === prev[category] ? "all" : id,
//     }));
//     setShowFilterDropdown(null);
//   };

//   const resetFilters = () => {
//     console.log("Resetting all filters");
//     setActiveFilters({
//       distance: "all",
//       courseType: "all",
//       rating: "all",
//       modeOfTeaching: "all",
//     });
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (filterRef.current && !filterRef.current.contains(event.target)) {
//         console.log("Closing filter dropdown");
//         setShowFilterDropdown(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="w-full min-h-screen overflow-x-hidden bg-gray-50">
//       <div className="w-full max-w-[90rem] mx-auto">
//         <Navbar />
//       </div>

//       <div className="w-full max-w-[86rem] flex flex-col md:flex-row items-center justify-between gap-10 mx-auto px-4 sm:px-6 py-8">
//         <h1 className="w-full md:w-1/2 text-4xl sm:text-5xl font-bold text-[#002639]">
//           Popular Tutorials in {locationQuery}
//         </h1>

//         <div className="flex items-center w-full md:w-1/2 h-14 sm:h-16 shadow-lg border border-gray-200 rounded-full overflow-hidden bg-white">
//           <div className="flex items-center gap-3 px-4 w-full">
//             <FaLocationDot className="text-green-600 size-5 sm:size-6" />
//             <input
//               type="text"
//               placeholder="Search by name or location..."
//               className="outline-none w-full text-gray-700 text-lg placeholder-gray-500"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               onKeyPress={(e) => {
//                 if (e.key === "Enter" && searchQuery.trim()) {
//                   console.log("Search triggered with query:", searchQuery);
//                   window.location.href = `/institutes-on-location?query=${encodeURIComponent(
//                     searchQuery
//                   )}`;
//                 }
//               }}
//               aria-label="Search by name or location"
//             />
//           </div>
//           <button
//             onClick={() => {
//               if (searchQuery.trim()) {
//                 console.log("Search button clicked with query:", searchQuery);
//                 window.location.href = `/institutes-on-location?query=${encodeURIComponent(
//                   searchQuery
//                 )}`;
//               }
//             }}
//             className="px-4 py-2 bg-[#2D7B67] text-white rounded-r-full hover:bg-[#256a57] transition"
//             aria-label="Search institutes"
//           >
//             <Search className="size-5 sm:size-6" />
//           </button>
//         </div>
//       </div>

//       <div className="w-full max-w-[86rem] mx-auto px-4 sm:px-6 mb-8">
//         <div className="flex flex-wrap items-center justify-between gap-4">
//           <div className="flex flex-wrap gap-2 sm:gap-4">
//             {Object.keys(filters).map((category) => (
//               <div key={category} className="relative" ref={filterRef}>
//                 <button
//                   onClick={() => {
//                     console.log(`Opening filter dropdown for ${category}`);
//                     setShowFilterDropdown(
//                       showFilterDropdown === category ? null : category
//                     );
//                   }}
//                   className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm sm:text-base hover:bg-gray-100 transition"
//                   aria-label={`Filter by ${category}`}
//                 >
//                   {category.charAt(0).toUpperCase() +
//                     category
//                       .slice(1)
//                       .replace(/([A-Z])/g, " $1")
//                       .trim()}
//                   <span className="text-gray-500">
//                     {filters[category].find(
//                       (item) => item.id === activeFilters[category]
//                     )?.name || "All"}
//                   </span>
//                 </button>
//                 {showFilterDropdown === category && (
//                   <div className="absolute z-10 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg">
//                     {filters[category].map((item) => (
//                       <div
//                         key={item.id}
//                         onClick={() => handleFilterChange(category, item.id)}
//                         className={`px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
//                           activeFilters[category] === item.id
//                             ? "bg-[#2D7B67] text-white"
//                             : "text-gray-700"
//                         }`}
//                       >
//                         {item.name}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//           <button
//             onClick={resetFilters}
//             className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm sm:text-base hover:bg-red-600 transition"
//             aria-label="Clear all filters"
//           >
//             Clear All Filters
//           </button>
//         </div>
//         <div className="flex flex-wrap gap-2 mt-4">
//           {Object.entries(activeFilters).map(
//             ([category, id]) =>
//               id !== "all" && (
//                 <div
//                   key={category}
//                   className="flex items-center gap-1 px-3 py-1 bg-[#2D7B67] text-white text-sm rounded-full"
//                 >
//                   {filters[category].find((item) => item.id === id)?.name || id}
//                   <FaTimes
//                     className="size-4 cursor-pointer"
//                     onClick={() => handleFilterChange(category, "all")}
//                   />
//                 </div>
//               )
//           )}
//         </div>
//       </div>

//       <div className="w-full max-w-[86rem] px-4 sm:px-6 py-6 sm:py-8 mx-auto mb-8">
//         <p className="text-black bg-gray-200 px-4 py-6 sm:px-6 sm:py-8 rounded-2xl text-3xl md:text-6xl lg:text-8xl text-center font-bold">
//           Advertisement
//         </p>
//       </div>

//       {loading ? (
//         <div className="w-full max-w-[88rem] mx-auto sm:mx-20 px-3 sm:px-4 py-6 sm:py-8 gap-4 sm:gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//           {[...Array(6)].map((_, i) => (
//             <div
//               key={i}
//               className="w-full max-w-[24rem] sm:max-w-[25rem] bg-white border border-gray-200 rounded-xl shadow-sm animate-pulse"
//             >
//               <div className="w-full aspect-[4/3] bg-gray-200 rounded-t-xl"></div>
//               <div className="p-4 space-y-3">
//                 <div className="h-6 bg-gray-200 rounded w-3/4"></div>
//                 <div className="flex items-center justify-between">
//                   <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//                   <div className="h-4 bg-gray-200 rounded w-1/4"></div>
//                 </div>
//                 <div className="h-4 bg-gray-200 rounded w-full"></div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : error ? (
//         <div className="text-center p-4 text-red-500 text-lg">{error}</div>
//       ) : filteredInstitutes.length === 0 ? (
//         <div className="text-center p-4 text-gray-600 text-lg">
//           No results found for "{searchQuery}"
//         </div>
//       ) : (
//         <div className="w-full max-w-[88rem] mx-auto sm:mx-20 px-3 sm:px-4 py-6 sm:py-8 gap-4 sm:gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 space-y-4 sm:space-y-0">
//           {filteredInstitutes.map((institute) => (
//             <Card key={institute.institute_id} institute={institute} />
//           ))}
//         </div>
//       )}

//       <div className="w-full mt-8">
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default InstitutesOnLocation;
