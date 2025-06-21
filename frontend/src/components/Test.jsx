import { assets } from "../assets/assets";

const Test = () => {
  return (
    <div className="w-full min-h-[55vh] bg-[#002639] flex flex-col md:flex-row items-center justify-between overflow-hidden">
      {/* Text and Button Section */}
      <div className="w-full md:w-[50%] py-12 px-6 md:px-20 flex flex-col items-start">
        <p className="text-white font-bold text-4xl md:text-7xl leading-tight">
          Search Smart <br />
          Learn Smart
        </p>
        <p className="text-white font-medium text-lg md:text-2xl mt-2">
          Start learning today
        </p>
        <div className="w-64 md:w-80 h-12 md:h-14 mt-6 md:mt-10 flex items-center justify-center bg-[#2D7B67] rounded-xl">
          <p className="text-white font-medium text-lg md:text-2xl">
            Get Started With Nextute
          </p>
        </div>
      </div>

      {/* Image Content */}
      <div className="w-full md:w-[65%] -mr-96 h-full flex items-center justify-center ">
        <img
          src={assets.SearchBanner}
          alt="Search Banner"
          className="w-full h-full object-contain md:object-cover max-h-[400px] md:max-h-[55vh]"
        />
      </div>
    </div>
  );
};

export default Test;
