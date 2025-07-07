import { assets } from "../assets/assets";

const PolygonComponent = () => {
  return (
    <div className="relative w-full max-w-[400px] h-[400px] flex flex-col items-center justify-center mx-auto ">
      <svg
        viewBox="-20 -50 65 65"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[400px] h-auto z-0"
      >
        <path
          d="M -12.724 0.135 C -14.064 -10.31 -14.465 -20.354 -14.733 -30.532 C -15.269 -35.621 -14.733 -38.299 -10.716 -39.505 L 23.969 -49.147 C 28.79 -50.218 35.352 -47.54 35.62 -36.826 C 35.084 -31.202 34.281 -20.22 32.138 -8.168 C 30.799 -4.15 30.799 -0.535 25.844 1.742 L -0.672 7.634 C -9.109 8.304 -11.519 4.42 -12.724 0.135"
          fill="#2D7B67"
          transform="rotate(-10) translate(5, 6)"
        />

        <path
          d="M -12.724 0.135 C -14.064 -10.31 -14.465 -20.354 -14.733 -30.532 C -15.269 -35.621 -14.733 -38.299 -10.716 -39.505 L 23.969 -49.147 C 28.79 -50.218 35.352 -47.54 35.62 -36.826 C 35.084 -31.202 34.281 -20.22 32.138 -8.168 C 30.799 -4.15 30.799 -0.535 25.844 1.742 L -0.672 7.634 C -9.109 8.304 -11.519 4.42 -12.724 0.135"
          className="fill-white stroke-black stroke-[0.1]"
        />
      </svg>

      <img
        src={assets.test3}
        alt="Avatar"
        className="w-20 h-20 object-cover rounded-full absolute top-0 left-44 md:left-48 transform -translate-x-1/2 z-10"
      />

      <div className="absolute z-10 text-center  px-16 mr-6">
        <h3 className="text-lg md:text-xl  font-semibold text-gray-700">
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
