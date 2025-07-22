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

    // const BACKEND_URL = "http://localhost:8080/api/institutes/all-institutes";
    const BACKEND_URL = `${import.meta.env.VITE_BACKEND_BASE_URL}/api/institutes/all-institutes`;


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