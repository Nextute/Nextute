import { FaStar } from "react-icons/fa";

const TestimonialCard= () => {
  return (
    <div className="my-20 flex items-center justify-center px-4">
      <div className="polygon relative bg-gradient-to-t from-[#ffffff] to-[#e8f3e2] rounded-[60px] max-w-xl w-full p-8 pt-16 text-center shadow-lg">

        <div className="absolute top-[-40px] left-0 rounded-full w-24 h-24 flex items-center justify-center shadow-xl">
          <img
            src="testimonialdp.jpg"
            alt="Profile"
            className="rounded-full"
          />
        </div>

        <div className="flex justify-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className="text-[#2d7a66] text-xl" />
          ))}
        </div>

        <p className="text-xs text-gray-800 leading-relaxed">
          LOREM IPSUM DOLOR SIT AMET, CONSECTETUER ADIPISCING ELIT,
          SED DIAM NONUMMY NIBH EUISMOD TINCIDUNT UT LAOREET DOLORE MAGNA ALIQUAM ERAT VOLUTPAT. UT WISI ENIM AD MINIM VENIAM, QUIS NOSTRUD EXERCITATION ULLAMCORPER.
        </p>

        <p className="text-xs text-gray-900 mt-2 font-bold leading-relaxed">
          LOREM IPSUM DOLOR SIT AMET, CONSECTETUER ADIPISCING ELIT,
          SED DIAM NONUMMY NIBH EUISMOD TINCIDUNT.
        </p>

        <div className="mt-4 text-sm text-gray-700 italic">
          <span className="inline-block px-3 py-1 rounded-full font-medium">
            - Hannah Montana
          </span>
        </div>

      </div>
    </div>
  );
};

export default TestimonialCard;