import { assets } from "../assets/assets";

const PolygonComponent = () => {
  return (
    <div className="relative w-full max-w-[400px] h-[400px] flex flex-col items-center justify-center mx-auto ">
      <svg
        viewBox="-21 -47 55 55"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[400px] h-auto z-0"
      >
        <path
          d="M -18 -2 L -14.843 -27.987 C -12.534 -30.682 -12.534 -33.376 -7.299 -35.839 L 17 -44 C 23 -44 26 -44 28 -38 L 31 -8 C 31 -1 29 0 25 2 L -8 6 C -15 7 -18 4 -18 -2"
          fill="#2D7B67"
          transform="rotate(-3) scale(-1, 1) translate(-16, -2)"
        />

        <path
          d="M -18 -2 L -14.312 -34.68 C -14.509 -38.828 -9.571 -42.976 -3.645 -42.976 L 16.107 -44.161 C 23.021 -45.149 27.366 -43.964 29.342 -37.248 L 31 -8 C 31 -1 29 0 25 2 L -8.583 6.998 C -15 7 -18 4 -18 -2"
          className="fill-white stroke-black stroke-[0.1]"
        />
      </svg>

      <img
        src={assets.test2}
        alt="Avatar"
        className="w-20 h-20 object-cover rounded-full absolute top-2 sm:top-0 left-48  md:left-56 transform -translate-x-1/2 z-10"
      />

      <div className="absolute z-10 text-center ml-8 px-16">
        <h3 className="text-lg md:text-xl font-semibold text-gray-700">
          Hannah Smmith
        </h3>
        <p className="text-sm text-gray-600 mb-1">UPSC Aspirant</p>
        <p className="text-6xl text-lightgreen mt-2">“</p>
        <p className="text-sm -mt-6 sm:text-base text-gray-600 text-wrap leading-snug px-17 md:px-25">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit
          itaque eaque earum voluptates deserunt blanditiis doloribus.
        </p>
      </div>
    </div>
  );
};

export default PolygonComponent;
