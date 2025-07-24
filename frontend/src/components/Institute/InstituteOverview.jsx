import React, { useState, useEffect } from "react";
import { FaCheckDouble, FaStar, FaPen } from "react-icons/fa";
import InstituteOverviewTabs from "./InstituteOverviewTabs";
import axios from "axios";

const InstituteOverview = ({ id }) => {
  const [selectedTab, setSelectedTab] = useState("Overview");
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [instituteData, setInstituteData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchInstituteData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/institutes/${id}`);
        if (res.data?.status) {
          setInstituteData(res.data.data);
        } else {
          setError("Invalid response from server.");
        }
      } catch (err) {
        setError("Failed to fetch institute details.");
      }
    };

    fetchInstituteData();
  }, [id]);

  const servicesData = [
    {
      title: "Professional Training Programs",
      description:
        "Industry-aligned courses designed to enhance practical skills in fields like technology, management, and design.",
    },
    {
      title: "Certification Courses",
      description:
        "Short-term and long-term certification programs to boost credentials and employability.",
    },
    {
      title: "Workshops & Seminars",
      description:
        "Interactive, expert-led sessions on emerging trends, tools, and techniques across various disciplines.",
    },
    {
      title: "Career Guidance & Mentorship",
      description:
        "One-on-one mentoring and career counseling to help learners make informed decisions and grow professionally.",
    },
  ];

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <FaStar key={i} className={i < rating ? "text-[#2D7B67]" : "text-gray-300"} />
      ));
  };

  const [reviewsData, setReviewsData] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "", email: "", details: "" });

  const toggleReviewForm = () => setIsWritingReview(!isWritingReview);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    const reviewToAdd = {
      rating: newReview.rating,
      comment: newReview.comment,
      author: newReview.email,
      details: newReview.details,
    };
    setReviewsData([...reviewsData, reviewToAdd]);
    setNewReview({ rating: 0, email: "", comment: "", details: "" });
    setIsWritingReview(false);
  };

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (!instituteData) {
    return <div className="text-center p-4">Loading institute overview...</div>;
  }

  return (
    <div className="bg-[#E6EDE2] rounded-2xl border border-black m-2 sm:m-8 py-4 px-6">
      <InstituteOverviewTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      {selectedTab === "Overview" && (
        <div className="space-y-4 mt-8 pb-1">
          <p>{instituteData.basic_info?.description || "No description available."}</p>
          <div>
            <h3 className="font-bold">Vision:</h3>
            <p>To provide top-quality education and training for defense services aspirants.</p>
          </div>
          <div>
            <h3 className="font-bold mb-1">Mission:</h3>
            <ul className="list-disc ml-5">
              <li>Deliver innovative and relevant educational programs.</li>
              <li>Foster a learner-centric environment.</li>
              <li>Collaborate with professionals and industry.</li>
            </ul>
          </div>
        </div>
      )}

      {selectedTab === "Services" && (
        <div className="space-y-5 mt-8 pr-12 pb-1">
          {servicesData.map((service, index) => (
            <div key={index} className="flex items-start gap-3">
              <FaCheckDouble className="text-green-800 text-xl mt-1" />
              <div>
                <p className="font-semibold text-base">{service.title}</p>
                <p className="text-md">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTab === "Reviews" && (
        <div className="mt-4 flex flex-col sm:flex-row justify-between">
          {!isWritingReview ? (
            <>
              <div className="space-y-3 sm:w-[80%] w-full">
                {reviewsData.map((review, index) => (
                  <div key={index} className="bg-white rounded-lg px-4 py-2">
                    <div className="flex gap-2">{renderStars(review.rating)}</div>
                    <p className="text-lg font-semibold">"{review.comment}"</p>
                    <p className="text-gray-700">{review.details}</p>
                    <p className="italic text-end">– {review.author}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={toggleReviewForm}
                className="mt-6 bg-[#2D7B67] text-white px-6 rounded hover:bg-[#1E5A4A] text-start py-2.5 h-1/2 flex items-center gap-x-2"
              >
                <FaPen className="text-white" />
                Write A Review
              </button>
            </>
          ) : (
            <div className="bg-white px-4 py-2 rounded-lg shadow border border-green-300 flex flex-col w-full">
              <h3 className="text-2xl font-semibold mb-1 text-[#2D7B67] flex justify-center">
                Write A Review
              </h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="flex items-center gap-3">
                  <label className="text-xl text-gray-700 font-medium whitespace-nowrap">Rating-</label>
                  <div className="flex sm:gap-2 gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                      >
                        <FaStar
                          className={`sm:text-2xl text-lg ${star <= newReview.rating ? "text-[#2D7B67]" : "text-gray-300"
                            }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-7">
                  <label className="text-xl text-gray-700 font-medium whitespace-nowrap">Email-</label>
                  <input
                    type="text"
                    className="w-1/2 p-1 border border-gray-700 rounded"
                    value={newReview.email}
                    onChange={(e) => setNewReview({ ...newReview, email: e.target.value })}
                    required
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-xl text-gray-700 font-medium whitespace-nowrap">Review-</label>
                  <textarea
                    className="w-1/2 p-1 border border-gray-700 rounded"
                    rows="3"
                    value={newReview.details}
                    onChange={(e) => setNewReview({ ...newReview, details: e.target.value })}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button type="submit" className="bg-[#2D7B67] text-white px-4 py-1 rounded hover:bg-[#1E5A4A]">
                    Submit Review
                  </button>
                  <button
                    type="button"
                    onClick={toggleReviewForm}
                    className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InstituteOverview;
