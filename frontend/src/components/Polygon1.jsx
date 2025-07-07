import { assets } from "../assets/assets";

const PolygonComponent = () => {
  return (
    <div className="relative w-full max-w-[400px] h-[400px] flex flex-col items-center justify-center mx-auto">
      <svg
        viewBox="-15 -40 50 50"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[400px] h-auto z-0"
      >
        <path
          d="M -8.41 -9.533 C -8.24 -17.864 -8.24 -26.195 -7.475 -34.441 C -6.455 -38.946 -4.755 -40.391 -0.164 -39.626 C 9.102 -36.481 17.943 -32.826 24.914 -30.36 C 28.229 -28.915 30.015 -27.215 28.994 -20.499 C 27.634 -13.868 26.104 -6.812 23.979 -0.522 C 23.129 1.859 22.024 5.004 17.433 4.494 L -4.16 -3.072 C -7.05 -4.177 -8.58 -6.302 -8.41 -9.618"
          fill="#2D7B67"
          transform="rotate(10) translate(-5, 1)"
        />
        <path
          d="M -8.41 -9.533 C -8.24 -17.864 -8.24 -26.195 -7.475 -34.441 C -6.455 -38.946 -4.755 -40.391 -0.164 -39.626 C 9.102 -36.481 17.943 -32.826 24.914 -30.36 C 28.229 -28.915 30.015 -27.215 28.994 -20.499 C 27.634 -13.868 26.104 -6.812 23.979 -0.522 C 23.129 1.859 22.024 5.004 17.433 4.494 L -4.16 -3.072 C -7.05 -4.177 -8.58 -6.302 -8.41 -9.618"
          className="fill-white stroke-black stroke-[0.1]"
        />
      </svg>

      <img
        src={assets.test1}
        alt="Avatar"
        className="w-20 h-20 object-cover rounded-full absolute top-2 sm:top-0 left-48 md:left-56 transform -translate-x-1/2 z-10"
      />

      <div className="absolute z-10 text-center mr-2 px-16">
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
