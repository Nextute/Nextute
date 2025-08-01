import { useEffect, useState } from "react";
import { assets } from "../../../assets/assets";
import Loader from "./Loader";

const ProfileSection = ({ studentData }) => {
  // studentData now directly contains the student object from API response
  const data = studentData || {};

  const [profile, setProfile] = useState({
    name: data.name || "Student Name",
    phoneNumber: data.phone_number || "",
    address: data.address || "",
    guardianName: data.guardianName || "",
    guardianPhoneNumber: data.guardianPhoneNumber || "",
    picture: assets.profilePlaceholder,
    completion: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!studentData) {
      return; // Wait until data is available
    }

    const calculateCompletion = () => {
      const fields = [
        data.name,
        data.gender,
        data.date_of_birth,
        data.student_id,
        data.phone_number,
        data.email,
        data.address,
        data.guardianName, // This field doesn't exist in API, keeping for now
        data.guardianPhoneNumber, // This field doesn't exist in API, keeping for now
        data.profileImage, // This field doesn't exist in API, keeping for now
      ];
      const filledFields = fields.filter(
        (field) => field && field !== ""
      ).length;
      const percentage = (filledFields / fields.length) * 100;
      return percentage.toFixed(0);
    };

    setProfile((prev) => ({
      ...prev,
      completion: calculateCompletion(),
      picture: data.profileImage || assets.upload_area,
      name: data.name || "Student Name",
      phoneNumber: data.phone_number || "",
      address: data.address || "",
      guardianName: data.guardianName || "",
      guardianPhoneNumber: data.guardianPhoneNumber || "",
    }));

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [studentData]);

  // Optional: show loading state if data not ready yet
  if (!studentData) {
    return <div>Loading profile...</div>;
  }

  const handlePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfile((prev) => ({ ...prev, picture: event.target.result }));

        setProfile((prev) => ({
          ...prev,
          completion:
            prev.completion < 100 ? parseInt(prev.completion) + 10 : 100,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file");
    }
  };

  return (
    <div className="w-full mx-auto px-4 sm:px-6 py-4 bg-[#E6EDE2] border border-black rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
      {/* Profile Picture and Name Section */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 space-x-5 w-full sm:w-auto">
        <div className="relative w-20 h-20 sm:w-24 md:w-36 sm:h-24 md:h-36 border-2 border-teal-500 rounded-full overflow-hidden">
          {isLoading ? (
            <div className="w-full h-full bg-gray-200 animate-pulse rounded-full"></div>
          ) : (
            <img
              src={profile.picture}
              alt="Student Profile"
              className="w-full h-full object-cover"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handlePictureUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
            aria-label="Upload profile picture"
          />
        </div>

        <div className="text-center sm:text-left">
          <p className="text-black text-2xl sm:text-3xl font-semibold leading-normal">
            {profile.name}
          </p>
          <p className="text-black text-xl sm:text-2xl font-normal leading-normal">
            Nextute
          </p>
        </div>
      </div>

      {/* Progress Section */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-2 sm:px-4">
        <Loader isLoading={isLoading} completion={profile.completion} />
        <div className="text-center">
          <p className="text-black text-2xl sm:text-3xl font-semibold leading-normal">
            {profile.completion}%
          </p>
          <p className="text-black text-lg sm:text-xl font-normal leading-normal">
            Profile Completed
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
