import { RectangleIcon } from "./RectangleIcon";

const SearchTest = () => {
  return (
    <div className="w-full h-[55%] mt-20">
      <p className="text-[#000000] font-bold text-4xl text-center">
        Stay updated with the latest coaching listings, student <br />
        reviews, and educational tools from Nextute.
      </p>
      <div className="flex items-center justify-between mt-10 w-full h-20 max-w-4xl mx-auto shadow-custom border border-[#000000] rounded-full overflow-hidden">
        {/* Left:  Input */}
        <div className="flex items-center gap-2 ml-3 px-4 py-2 w-full">
          <input
            type="text"
            placeholder="Email Input..."
            className="outline-none bg-[#FFFFFF] w-full text-gray-700 placeholder:[#000] placeholder:opacity-90 placeholder:text-2xl"
          />
        </div>
        <div className="relative h-full w-full flex items-center justify-center px-4 py-2">
          {/* Background Rectangles */}
          <div className="relative flex items-center justify-center">
            {/* First Rectangle */}
            <RectangleIcon
              height={220}
              width={90}
              color="#204B55"
              className="absolute transform rotate-[48deg] translate-x-[200%] z-10 mix-blend-multiply"
            />
            {/* Second Rectangle */}
            <RectangleIcon
              height={330}
              width={90}
              color="#AAD294"
              className="absolute transform -rotate-[60deg] translate-x-[200%] z-10 mix-blend-multiply"
            />

            {/* Search Icon */}
            <p className="absolute translate-x-[600%] size-6 text-white z-50">
              Subscribe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchTest;
