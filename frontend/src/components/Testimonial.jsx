import { assets } from "../assets/assets";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import Polygon1 from "./Polygon1";
import Polygon2 from "./Polygon2";
import Polygon3 from "./Polygon3";

const Testimonial = () => {
  return (
    <>
      {/*---------HEADING SECTION---------*/}

      <div className="min-h-screen px-4 py-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#002639] mb-2">
          “Voices of Success”
        </h1>
        <p className="text-[#002639] font-medium mb-20 text-2xl sm:text-3xl">
          Our Student Stories
        </p>

        <div className="flex flex-col lg:flex-row lg:justify-center lg:items-start">
          <Polygon1 />
          <Polygon2 />
          <Polygon3 />
        </div>
      </div>

      {/*------------DOT ICON AND SIDE BUTTONS-----------*/}
      <div className="flex items-center justify-evenly mb-12">
        <FaChevronLeft className="size-10 text-[#525252]" />

        {/*-------------TEST  DOT ICON--------------*/}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="177"
          height="28"
          viewBox="0 0 177 28"
          fill="none"
        >
          <circle cx="13.6154" cy="13.6154" r="13.6154" fill="#2D7B67" />
          <circle cx="52.7608" cy="13.6143" r="6.80771" fill="#525252" />
          <circle cx="91.9054" cy="13.6143" r="6.80771" fill="#525252" />
          <circle cx="131.046" cy="13.6143" r="6.80771" fill="#525252" />
          <circle cx="170.191" cy="13.6143" r="6.80771" fill="#525252" />
        </svg>

        <FaChevronRight className="size-10 text-[#525252]" />
      </div>
    </>
  );
};

export default Testimonial;
