import React from "react";
import { assets } from "../assets/assets";

const Test = () => {
  return (
    <div className="w-full h-[50vh] bg-[#002639] flex flex-col md:flex-row items-center justify-between overflow-hidden">
      {/* Text and Button Section */}
      <div className="w-full md:w-1/2 py-8 sm:py-12 px-4 sm:px-8 md:px-12 lg:px-16 flex flex-col items-start">
        <h1 className="text-white font-semibold text-4xl md:text-5xl lg:text-6xl leading-tight font-poppins ml-16 sm:ml-0">
          Search Smart <br />
          Learn Smart
        </h1>
        <p className="text-white font-medium text-lg md:text-xl mt-4 md:mt-4 font-poppins ml-24 sm:ml-0">
          Start learning today
        </p>
        <div className="w-56 sm:w-64 md:w-72 lg:w-80 h-12 md:h-14 mt-8  lg:mt-8  ml-16 sm:ml-0 flex items-center justify-center bg-[#2D7B67] rounded-xl hover:bg-[#1A433A] transition-colors duration-300">
          <p className="text-white font-medium text-base sm:text-lg md:text-xl font-poppins">
            Get Started With Nextute
          </p>
        </div>
      </div>

      {/* Image Content */}
      <div className="w-full md:w-1/2 h-auto hidden lg:flex items-center justify-center md:justify-end">
        <img
          src={assets.SearchBanner2}
          alt="Interactive learning platform illustration"
          className="w-full h-auto object-contain max-h-[40vh] sm:max-h-[50vh] md:max-h-[60vh] lg:max-h-[90vh] translate-x-60"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default Test;
