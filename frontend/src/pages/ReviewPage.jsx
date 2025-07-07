import { useState } from "react";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import Footer from "../components/Footer";

const ReviewPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comment: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
  };

  return (
    <div className="w-full bg-white min-h-screen">
      <Navbar />
      <div className="flex flex-col-reverse md:flex-row items-center justify-between px-4 sm:px-6 lg:px-20 py-10 gap-10 -mt-8">
        {/* Left Section: Form */}
        <div className="w-full md:w-1/2">
          <h2 className="text-black font-montserrat text-4xl sm:text-5xl font-semibold leading-normal mb-6">
            Leave us a "COMMENT"
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-black text-xl font-medium">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
                className="px-4 py-2 border bg-[#E6EDE2] border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2D7B67] focus:border-[#2D7B67] text-lg"
              />
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-black text-xl font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="px-4 py-2 border bg-[#E6EDE2] border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2D7B67] focus:border-[#2D7B67] text-lg"
              />
            </div>

            {/* Comment Field */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="comment"
                className="text-black text-xl font-medium"
              >
                Comment<span className="text-red-500">*</span>
              </label>
              <textarea
                id="comment"
                name="comment"
                rows="5"
                placeholder="Write your thoughts here..."
                value={formData.comment}
                onChange={handleChange}
                required
                className="px-4 py-2 border bg-[#E6EDE2] border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2D7B67] focus:border-[#2D7B67] text-lg resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-4 bg-[#2D7B67] text-white py-3 px-8 rounded-xl hover:bg-[#222F3E] transition duration-200 text-lg sm:text-xl font-medium max-md:float-end"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Right Section: Banner */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={assets.ReviewBanner}
            alt="Review Banner"
            className="w-full max-w-md object-contain"
          />
        </div>
      </div>

    {/*  ------FOOTER------  */}
      <Footer />
    </div>
  );
};

export default ReviewPage;
