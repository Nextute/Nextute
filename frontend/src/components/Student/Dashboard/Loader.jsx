import { useEffect, useState } from "react";

const Loader = ({ isLoading, completion }) => {
  const [animatedCompletion, setAnimatedCompletion] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      let start = 0;
      const duration = 1000;
      const increment = completion / (duration / 16);
      const animate = () => {
        start += increment;
        if (start >= completion) {
          setAnimatedCompletion(completion);
          return;
        }
        setAnimatedCompletion(start);
        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [isLoading, completion]);
  const getLoaderStyle = (percentage) => {
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    return {
      strokeDasharray: `${circumference} ${circumference}`,
      strokeDashoffset: strokeDashoffset,
      transition: isLoading ? "none" : "stroke-dashoffset 0.016s linear",
    };
  };

  return (
    <div
      className="relative w-20 h-20 sm:w-24 md:w-28 sm:h-24 md:h-28"
      aria-label="Profile Completion Loader"
    >
      {isLoading ? (
        <div className="w-full h-full bg-gray-200 animate-pulse rounded-full"></div>
      ) : (
        <>
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-gray-200"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
            />
            <circle
              className="text-[#2D7B67]"
              strokeWidth="10"
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
              style={getLoaderStyle(animatedCompletion)}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-black font-semibold text-base sm:text-xl">
            {Math.round(animatedCompletion)}%
          </div>
        </>
      )}
    </div>
  );
};

export default Loader;
