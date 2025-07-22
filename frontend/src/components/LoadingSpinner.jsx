const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-4">
    <div className="w-8 h-8 border-4 border-[#2D7B67] border-t-transparent rounded-full animate-spin"></div>
    <span className="mt-2 text-base font-medium text-gray-700 animate-pulse">
      Loading institutes...
    </span>
  </div>
);

export default LoadingSpinner;