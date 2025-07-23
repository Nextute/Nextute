import React from "react";

const PolygonComponent = () => {
  return (
    <div className="flex justify-center items-center my-20 relative">

      <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-72 md:h-72 lg:w-64 lg:h-64 xl:w-72 xl:h-72 bg-[#e6ede2] rounded-3xl rotate-45 flex items-center justify-center relative border border-[#28515b] transition-transform duration-500 ease-in-out hover:rotate-[405deg]">

        <img
          src="testimonialdp.jpg"
          alt="Profile"
          className="absolute -rotate-45 top-[-40px] left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full border border-[#28515b]"
        />

        <div className="absolute -rotate-45 z-10 text-center px-4">
          <h3 className="text-lg font-semibold text-black">Hannah Smmith</h3>
          <p className="text-sm text-gray-600 mb-1">UPSC Aspirant</p>
          <p className="text-6xl text-lightgreen mt-5">“</p>
          <p className="text-xs md:text-sm -mt-7 text-gray-600 leading-snug max-w-[200px] sm:max-w-[200px] md:max-w-[220px] mx-auto">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit itaque eaque earum voluptates deserunt blanditiis doloribus.
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default PolygonComponent;


// const PolygonComponent = () => {
//   return (
//     <div className="relative w-full max-w-[400px] h-[400px] flex flex-col items-center justify-center mx-auto">
//       <div className="relative">
//         <div className="shadow-shape-1"></div>
//         <div className="shape-1"></div>
//       </div>

//       <img
//         src="https://randomuser.me/api/portraits/women/1.jpg"
//         alt="Avatar"
//         className="w-20 h-20 md:w-20 md:h-20 rounded-full absolute top-3 right-20 transform -translate-x-1/2 z-10"
//       />

      // <div className="absolute z-10 text-center px-4">
      //   <h3 className="text-lg font-semibold text-gray-700">Hannah Smmith</h3>
      //   <p className="text-sm text-gray-600 mb-1">UPSC Aspirant</p>
      //   <p className="text-6xl text-lightgreen mt-5">“</p>
      //   <p className="text-xs md:text-sm -mt-7 text-gray-600 leading-snug max-w-[200px] sm:max-w-[200px] md:max-w-[220px] mx-auto">
      //     Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit itaque eaque earum voluptates deserunt blanditiis doloribus.
      //   </p>
      // </div>
//     </div>
//   );
// };

// export default PolygonComponent;