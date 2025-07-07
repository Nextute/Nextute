import SidePanel from "./SidePanel.jsx";
import add from "../../../assets/add.png";
import location from "../../../assets/location.svg";
import mailIcon from "../../../assets/envelope.svg";
import phone from "../../../assets/phone-solid.svg";
import { useNavigate } from "react-router-dom";
import { useFetchInstituteData } from "./InstituteData.jsx";

const InstituteDashBoard = () => {
  const navigate = useNavigate();
  const { instituteData, loading, error, hasRenderedOnce } = useFetchInstituteData();

  return (
    <div className="w-full min-h-screen flex flex-row">
      <SidePanel />
      <div className="flex flex-col sm:p-8 p-4 gap-5 w-full sm:w-[80vw]">
        <h1 className="text-3xl font-medium">Hello, {instituteData?.institute_name}</h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-8">
          <div className="bg-[#E6EDE2] border border-black rounded-2xl flex justify-between px-3 py-4 w-full sm:w-[32%]">
            <p>Students enrolled</p>
            <p className="underline text-xl">235</p>
          </div>
          <div className="bg-[#E6EDE2] border border-black rounded-2xl flex justify-between px-3 py-4 w-full sm:w-[32%]">
            <p>Teachers Onboard</p>
            <p className="underline text-xl">235</p>
          </div>
          <div className="bg-[#E6EDE2] border border-black rounded-2xl flex justify-between px-3 py-4 w-full sm:w-[32%]">
            <p>Ongoing Batches</p>
            <p className="underline text-xl">235</p>
          </div>
        </div>
        <div className="flex sm:flex-row flex-col sm:gap-8 gap-2">
          <div className="bg-[#E6EDE2] border border-black rounded-2xl w-full sm:w-[67%] sm:px-8 sm:py-4 p-2">
            <h1 className="text-2xl">Batches and Course details</h1>
            <div className="flex flex-col gap-1">
              <div className="flex flex-row gap-3 w-full mt-5">
                <div className="bg-white border border-black rounded-2xl flex justify-between w-full sm:w-[55%] px-3 py-3">
                  <h1 className="text-xl">Batch 1</h1>
                  <p>JEE regular</p>
                </div>
                <div className="bg-white border border-black rounded-2xl flex justify-between w-full sm:w-[55%] px-3 py-3">
                  <h1 className="text-xl">Batch 1</h1>
                  <p>JEE regular</p>
                </div>
              </div>
              <div className="flex flex-row gap-3 w-full mt-5">
                <div className="bg-white border border-black rounded-2xl flex justify-between w-[55%] px-3 py-3">
                  <h1 className="text-xl">Batch 2</h1>
                  <p>JEE regular</p>
                </div>
                <div className="bg-white border border-black rounded-2xl flex justify-between w-[55%] px-3 py-3">
                  <h1 className="text-xl">Batch 2</h1>
                  <p>JEE regular</p>
                </div>
              </div>
              <div className="flex flex-row gap-3 w-full mt-5">
                <div className="bg-white border border-black rounded-2xl flex justify-between w-[55%] px-3 py-3">
                  <h1 className="text-xl">Batch 3</h1>
                  <p>JEE regular</p>
                </div>
                <div className="bg-white border border-black rounded-2xl flex justify-between w-[55%] px-3 py-3">
                  <h1 className="text-xl">Batch 3</h1>
                  <p>JEE regular</p>
                </div>
              </div>
              <div className="flex flex-row gap-3 w-full mt-5">
                <div className="bg-white border border-black rounded-2xl flex justify-between w-[55%] px-3 py-3">
                  <h1 className="text-xl">Batch 4</h1>
                  <p>JEE regular</p>
                </div>
                <div className="bg-white border border-black rounded-2xl flex justify-between w-[55%] px-3 py-3">
                  <h1 className="text-xl">Batch 4</h1>
                  <p>JEE regular</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full sm:w-[32%]">
            <div className="bg-[#E6EDE2] border border-black rounded-2xl px-5 py-3 h-[75%]">
              <h1 className="text-xl">Achievements</h1>
              <div className="flex flex-col mt-3 gap-2">
                <div className="border border-black rounded-2xl p-2">
                  Air 1 JEE arunesh
                </div>
                <div className="border border-black rounded-2xl p-2">
                  Air 1 JEE arunesh
                </div>
                <img
                  src={add}
                  alt="Add logo"
                  className="w-10 sm:w-10 mx-auto"
                ></img>
              </div>
            </div>
            <label
              htmlFor="media-upload"
              className="cursor-pointer bg-[#E6EDE2] border border-black rounded-2xl p-5 h-[23%] flex items-center justify-center gap-3"
            >
              <img src={add} alt="Add logo" className="w-10 h-10" />
              <p className="text-2xl">Add Media</p>
              <input
                type="file"
                id="media-upload"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    console.log("Selected file:", file);
                  }
                }}
              />
            </label>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="bg-[#E6EDE2] border border-black rounded-2xl px-5 py-2 w-full sm:w-[67%]">
            <h2 className="text-xl font-semibold">Contact Details</h2>
            <hr className="border-t border-dotted border-black my-1" />
            {/* Address */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-start gap-3">
                <img src={location} alt="location" className="w-6 h-6 mt-1" />
                <p>
                  12/7 Silverleaf Apartments, Sector 9, Indrapuram, New Delhi –
                  110099
                </p>
              </div>
              <p className="underline cursor-pointer">Edit</p>
            </div>

            {/* Phone */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-3">
                <img src={phone} alt="phone" className="w-6 h-6" />
                <div>
                  <p className="font-semibold">phone number</p>
                  <p>{instituteData?.contact}</p>
                </div>
              </div>
              <p className="underline cursor-pointer">Edit</p>
            </div>

            {/* Email */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img src={mailIcon} alt="email" className="w-6 h-6" />
                <div>
                  <p className="font-semibold">email address</p>
                  <p>{instituteData?.email}</p>
                </div>
              </div>
              <p className="underline cursor-pointer">Edit</p>
            </div>
          </div>
          <div className="flex flex-col w-full sm:w-[32%] gap-5">
            <div className="bg-[#E6EDE2] border border-black rounded-2xl p-5 h-[44%]">
              <button
                onClick={() => navigate("/facultiesdetails")}
                className="flex items-center justify-center gap-3 bg-transparent border-none cursor-pointer w-full"
              >
                <img src={add} alt="Add logo" className="w-10 h-10" />
                <p className="text-2xl">Add Teacher</p>
              </button>
            </div>
            <div className="bg-[#E6EDE2] border border-black rounded-2xl p-5 h-[44%]">
              <div className="flex items-center justify-center gap-3">
                <img src={add} alt="Add logo" className="w-10 h-10" />
                <p className="text-2xl">Add Student</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default InstituteDashBoard;
