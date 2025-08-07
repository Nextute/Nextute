const LoadingSpinner = () => (
  <div className="absolute inset-0 z-10 flex justify-center items-center bg-white/70 backdrop-blur-sm">
    <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default LoadingSpinner;
