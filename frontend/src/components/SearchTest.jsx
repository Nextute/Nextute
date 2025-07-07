import { RectangleIcon } from "./RectangleIcon";

const SearchTest = () => {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 mt-20 mb-12 hidden lg:block">
      {/* Heading */}
      <p className="text-[#000000] font-bold text-2xl sm:text-3xl lg:text-4xl text-center leading-snug max-w-4xl mx-auto">
        Stay updated with the latest coaching listings, student{" "}
        <br className="hidden sm:block" />
        reviews, and educational tools from Nextute.
      </p>

      {/* Search Box */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 mt-10 w-full max-w-4xl mx-auto shadow-custom border border-[#000000] rounded-full overflow-hidden px-4 py-2 bg-white">
        {/* Input Field */}
        <input
          type="text"
          placeholder="Email Input..."
          className="flex-grow w-full outline-none bg-white text-gray-700 placeholder:text-gray-500 placeholder:text-lg py-3 px-4"
        />

        {/* Subscribe Button with background graphics */}
        <button className="relative flex items-center justify-center px-6 py-3 rounded-full bg-transparent overflow-visible z-10">
          {/* Background Rectangles */}
          <RectangleIcon
            height={220}
            width={90}
            color="#204B55"
            className="absolute transform rotate-[48deg] translate-x-8 z-0 mix-blend-multiply hidden sm:block"
          />
          <RectangleIcon
            height={330}
            width={90}
            color="#AAD294"
            className="absolute transform -rotate-[60deg] translate-x-6 z-0 mix-blend-multiply hidden sm:block"
          />

          {/* Button Text */}
          <span className="relative z-20 text-white font-semibold translate-x-5 text-base sm:text-lg">
            Subscribe
          </span>
        </button>
      </div>
    </section>
  );
};

export default SearchTest;
