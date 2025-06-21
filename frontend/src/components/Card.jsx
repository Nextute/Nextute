import { assets } from "../assets/assets";
import { FaLocationDot } from "react-icons/fa6";
import { BsChatTextFill } from "react-icons/bs";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";

const Card = () => {
  return (
    <div className="w-full max-w-md px-2 py-3 flex justify-center">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-3 sm:p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
        {/* Image Section */}
        <div className="w-full max-h-48 aspect-[4/3] overflow-hidden rounded-t-xl border border-gray-200">
          <img
            src={assets.coaching}
            alt="Coaching - Alpha Classes"
            className="object-contain"
            loading="lazy"
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mt-4">
          <h2 className="font-semibold text-2xl sm:text-[28px] leading-tight tracking-tight text-gray-900">
            Alpha Classes
          </h2>
          <p className="font-medium text-lg sm:text-[20px] leading-tight tracking-tight text-yellow-500 flex items-center">
            ★★★★★
          </p>
        </div>

        {/* Location + Verified */}
        <div className="flex justify-between items-start mt-3">
          <div className="flex items-start gap-2 max-w-[80%]">
            <FaLocationDot
              className="text-green-700 text-lg sm:text-2xl mt-1 shrink-0"
              aria-hidden="true"
            />
            <p className="text-xs sm:text-[12px] text-gray-800 leading-snug">
              12/7 Silverleaf Apartments, Sector 9, Indrapuram,
              <br /> New Delhi – 110099
            </p>
          </div>
          <div className="shrink-0">
            <img src={assets.verify} alt="verify icon" />
          </div>
        </div>

        {/* Coaching Services */}
        <div className="flex gap-2  flex-wrap">
          {["JEE", "XII Boards", "X Boards"].map((service, index) => (
            <span
              key={index}
              className="bg-gray-100 rounded-full px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-[14px] font-medium text-gray-900"
            >
              {service}
            </span>
          ))}
        </div>

        {/* Contact Section */}
        <div className="flex items-center mt-4 sm:mt-5 gap-2 sm:gap-3 flex-wrap">
          <button
            type="button"
            className="flex items-center gap-2 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            aria-label="Call Alpha Classes"
          >
            <FaPhoneAlt
              className="text-green-700 text-sm sm:text-base"
              aria-hidden="true"
            />
            <p className="text-xs sm:text-[12px] font-medium">+91 9123456789</p>
          </button>
          <button
            type="button"
            className="flex items-center gap-2 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            aria-label="Contact via WhatsApp"
          >
            <IoLogoWhatsapp
              className="text-green-700 text-sm sm:text-base"
              aria-hidden="true"
            />
            <p className="text-xs sm:text-[12px] font-medium">WhatsApp</p>
          </button>
          <button
            type="button"
            className="flex items-center gap-2 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            aria-label="Enquire about Alpha Classes"
          >
            <BsChatTextFill
              className="text-green-700 text-sm sm:text-base"
              aria-hidden="true"
            />
            <p className="text-xs sm:text-[12px] font-medium">Enquire</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
