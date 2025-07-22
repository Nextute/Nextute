const PolygonComponent = () => {
    return (
        <div className="relative w-full max-w-[400px] h-[400px] flex flex-col items-center justify-center mx-auto">

            <div className="relative">
                <div className="shadow-shape-3"></div>
                <div className="shape-3"></div>
            </div>

            <img
                src="https://randomuser.me/api/portraits/women/1.jpg"
                alt="Avatar"
                className="w-20 h-20 rounded-full absolute top-5 md:top-7 lg:top-1 left-45 md:right-20 transform -translate-x-1/2 z-10"
            />

            <div className="absolute z-10 text-center">
                <h3 className="text-lg font-semibold text-gray-700">Hannah Smmith</h3>
                <p className="text-sm text-gray-600 mb-1">UPSC Aspirant</p>
                <p className="text-6xl text-lightgreen mt-5">“</p>
                <p className="text-xs md:text-sm -mt-7 text-gray-600 leading-snug max-w-[200px] sm:max-w-[200px] md:max-w-[220px] mx-auto">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit itaque eaque earum voluptates deserunt blanditiis doloribus.
                </p>
            </div>
        </div>
    );
};

export default PolygonComponent;