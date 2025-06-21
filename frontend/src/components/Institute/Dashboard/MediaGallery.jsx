import React from "react";
import { FiUpload } from "react-icons/fi";

const MediaGallery = () => {
  return (
    <div className="grid grid-cols-3 bg-[#E6EEE3] border-1 border-black rounded-2xl p-4 gap-7">
      <div className="h-72 relative bg-white border-1 border-black rounded-xl p-4">
        <h4 className="text-xl font-semibold">Photos of Classroom</h4>
        <p className="text-sm text-gray-500">JPEG, PNG, JPG of less than 5MB</p>
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black text-5xl">
          <FiUpload />
        </span>
      </div>
      <div className="h-72 relative bg-white border-1 border-black rounded-xl p-4">
        <h4 className="text-xl font-semibold">Demo Class Video</h4>
        <p className="text-sm text-gray-500">Less than 100MB</p>
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black text-5xl">
          <FiUpload />
        </span>
      </div>
      <div className="h-72 relative bg-white border-1 border-black rounded-xl p-4">
        <h4 className="text-xl font-semibold">Video Tour(If available)</h4>
        <p className="text-sm text-gray-500">Less than 100MB</p>
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black text-5xl">
          <FiUpload />
        </span>
      </div>
    </div>
  );
};

export default MediaGallery;
