import { useRef, useState } from "react";
import { assets } from "../../../assets/assets";

// GENDER ICONS
const genderIcons = {
  male: assets.maleIcon,
  female: assets.femaleIcon,
  default: assets.defaultGenderIcon,
};

const MainContent = ({ studentData }) => {
  // Safe fallback in case studentData or studentData.data is undefined
  const data = studentData?.data || {};

  const [isEditing, setIsEditing] = useState({
    address: false,
    guardian: false,
  });
  const [address, setAddress] = useState(data.address || "");
  const [guardianName, setGuardianName] = useState(data.guardianName || "");
  const addressInputRef = useRef(null);
  const guardianInputRef = useRef(null);

  const handleEdit = (field) => {
    setIsEditing((prev) => ({
      ...prev,
      [field]: true,
    }));
    setTimeout(() => {
      if (field === "address") {
        addressInputRef.current?.focus();
      } else if (field === "guardian") {
        guardianInputRef.current?.focus();
      }
    }, 0);
  };

  const handleSave = (field) => {
    setIsEditing((prev) => ({
      ...prev,
      [field]: false,
    }));
    // Optionally, send updated data to backend here
    // e.g., field === 'address' ? updateAddress(address) : updateGuardianName(guardianName);
  };

  return (
    <div className="w-full mx-auto">
      {/*--------- TOP ROW: ID, GENDER, ADDRESS --------*/}
      <div className="w-full  max-w-5xl flex flex-col-reverse sm:flex-row gap-4 py-4">
        {/* Left Column: Student ID and Gender */}
        <div className="w-full sm:w-[36.5%] flex flex-col gap-3">
          {/* Student ID */}
          <div className="bg-[#E6EDE2] border border-black rounded-3xl shadow-sm px-4 py-2">
            <div className="flex items-center px-16 gap-3">
              <img
                src={assets.student_id}
                alt="Student ID Icon"
                className="w-6 h-6"
              />
              <p className="text-xl font-semibold text-black">Student Id</p>
            </div>
            <p className="text-sm text-[#263238] font-medium px-20 py-2">
              {data.student_id || "N/A"}
            </p>
          </div>

          {/* Gender */}
          <div className="bg-[#E6EDE2] border border-black rounded-3xl shadow-sm px-4 py-2">
            <div className="flex items-center px-16 gap-2">
              <img
                src={
                  data.gender?.toLowerCase() === "male"
                    ? genderIcons.male
                    : data.gender?.toLowerCase() === "female"
                    ? genderIcons.female
                    : genderIcons.default
                }
                alt="Gender Icon"
                className="w-6 h-6"
              />
              <p className="text-xl font-semibold text-black">Gender</p>
            </div>
            <p className="text-sm text-[#263238] font-medium px-24 py-2">
              {data.gender || "Not specified"}
            </p>
          </div>
        </div>

        {/* Right Column: Address */}
        <div className="w-full sm:w-[70%]">
          <div className="bg-[#E6EDE2] border border-black rounded-3xl shadow-sm px-4 py-2 h-full">
            <div className="flex items-center justify-between">
              <span className="flex items-center px-4 gap-2">
                <img
                  src={assets.address}
                  alt="Address Icon"
                  className="w-6 h-6"
                />
                <p className="text-xl font-semibold text-black">Address</p>
              </span>
              {isEditing.address ? (
                <button
                  onClick={() => handleSave("address")}
                  className="text-[#263238] font-medium text-base underline underline-offset-auto decoration-solid decoration-auto [text-underline-position:from-font]"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => handleEdit("address")}
                  className="text-[#263238] font-medium text-base underline underline-offset-auto decoration-solid decoration-auto [text-underline-position:from-font]"
                >
                  Edit
                </button>
              )}
            </div>
            <input
              type="text"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={!isEditing.address}
              ref={addressInputRef}
              className={`mt-4 w-full ${
                isEditing.address ? "sm:w-[90%] mx-8" : "sm:w-[70%] mx-8"
              }   px-6 py-2 text-lg text-[#263238] focus:outline-none 
            ${
              isEditing.address
                ? "bg-white border border-gray-400 rounded-md"
                : "bg-transparent disabled:cursor-not-allowed"
            }`}
            />
          </div>
        </div>
      </div>

      {/*---------BOTTOM SECTION--------*/}
      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-4">
        {/* LEFT SIDE: DOB, GUARDIAN, MEMBERSHIP, PAYMENT */}
        <div className="flex-1 flex flex-col gap-4">
          {/* DOB + Guardian */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* DOB */}
            <div className="flex-1 bg-[#E6EDE2]  border border-black rounded-3xl shadow-sm">
              <div className="flex items-center gap-2 px-20 py-2">
                <img src={assets.dob} alt="DOB" className="w-6 h-6" />
                <p className="text-xl font-semibold text-black">
                  Date of Birth
                </p>
              </div>
              <p className="text-base font-medium text-black px-[6.5rem] py-3">
                {data.date_of_birth
                  ? new Date(data.date_of_birth).toLocaleDateString()
                  : "Not provided"}
              </p>
            </div>

            {/* Guardian */}
            <div className="flex-1 bg-[#E6EDE2] border border-black rounded-3xl shadow-sm">
              <div className="flex items-center justify-between px-6 py-2">
                <span className="flex items-center gap-3">
                  <img src={assets.people} alt="Guardian" className="w-6 h-6" />
                  <p className="text-xl font-semibold text-black">Guardian</p>
                </span>
                {isEditing.guardian ? (
                  <button
                    onClick={() => handleSave("guardian")}
                    className="text-[#263238] font-medium text-base underline underline-offset-auto decoration-solid decoration-auto [text-underline-position:from-font]"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit("guardian")}
                    className="text-[#263238] font-medium text-base underline underline-offset-auto decoration-solid decoration-auto [text-underline-position:from-font]"
                  >
                    Edit
                  </button>
                )}
              </div>
              <input
                type="text"
                placeholder="Name"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                disabled={!isEditing.guardian}
                ref={guardianInputRef}
                className={`w-full ${
                  isEditing.guardian ? "sm:w-[80%] mx-6" : "sm:w-[60%] mx-6"
                }  px-12 py-1.5 text-lg text-[#263238] focus:outline-none 
            ${
              isEditing.guardian
                ? "bg-white border border-gray-400 rounded-md"
                : "bg-transparent disabled:cursor-not-allowed"
            }`}
              />
            </div>
          </div>

          {/* Membership + Payment */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Membership */}
            <div className="flex-1 bg-[#E6EDE2] rounded-3xl shadow-sm min-h-[250px] border border-black">
              <p className="text-xl font-semibold text-black px-6 py-3 border-b-2 mb-6 text-center mx-6 border-dashed border-black">
                Memberships
              </p>
              <div className="flex items-center justify-center gap-3 mx-3 py-2 border border-black rounded-2xl">
                <span className="w-2 h-2 bg-black rounded-full"></span>
                <p className="text-base text-black">Personalized membership</p>
              </div>
            </div>

            {/* Payment */}
            <div className="flex-1 bg-[#E6EDE2] rounded-3xl shadow-sm min-h-[250px] border border-black">
              <div className="flex items-center justify-center gap-2 px-6 py-3 border-b-2 mb-6 mx-6 border-dashed border-black">
                <img src={assets.dollar} alt="Dollar" className="w-6 h-6" />
                <p className="text-xl font-semibold text-black">
                  Payment Status
                </p>
              </div>
              <div className="flex flex-col items-center py-4 gap-2">
                <img src={assets.paid} alt="Paid" className="w-16 h-16" />
                <p className="text-xl sm:text-3xl font-normal text-black">
                  Paid
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Institute searched */}
        <div className="w-full lg:w-64 xl:w-72 bg-[#E6EDE2] rounded-3xl shadow-sm border border-black flex flex-col self-stretch">
          <div className="flex items-center justify-center gap-2 px-2 py-4 border-b-2 mx-6 border-dashed border-black">
            <img src={assets.course} alt="Course Icon" className="w-6 h-6" />
            <p className="text-xl font-semibold text-black">
              Institute searched
            </p>
          </div>
          <div className="flex flex-col px-6 py-4 gap-2">
            {["Alpha", "Beta", "Gama", "Geta"].map((name, index) => (
              <div
                key={index}
                className="flex items-center gap-2.5 border border-black rounded-2xl px-4 py-2"
              >
                <span className="w-2 h-2 bg-black rounded-full"></span>
                <p className="text-base text-black">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
