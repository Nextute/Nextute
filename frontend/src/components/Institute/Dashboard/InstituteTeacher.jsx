import SidePanel from "./SidePanel.jsx";
import { useNavigate } from "react-router-dom";
import edit from "../../../assets/pencil.svg";
import deletebin from "../../../assets/trash.svg";
const InstituteTeacher = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-screen flex flex-row">
      <SidePanel />
      <div className="bg-[#E6EDE2] sm:p-8 p-2 border border-black w-full sm:w-[80vw] rounded-2xl">
        <h1 className="text-3xl font-medium p-5">Teachers Details</h1>
        <div className="flex flex-col items-center w-full">
          <div className="relative flex flex-col sm:flex-row bg-white border border-black rounded-2xl px-6 py-4 w-[96%]">
            <div className="absolute top-0 right-0 flex gap-2 p-2">
              <img
                src={edit}
                alt="edit logo"
                className="w-4 h-4 cursor-pointer"
                onClick={() => navigate("/facultiesdetails")}
              />
              <img
                src={deletebin}
                alt="delete logo"
                className="w-4 h-4 cursor-pointer"
              />
            </div>
            <div className="flex sm:flex-row flex-col gap-2 items-center">
              <div className="w-16 h-16 border-2 border-black rounded-full" />
              <div className="flex flex-col">
                <h2 className="text-xl font-semibold">Teacher Name</h2>
                <div className="flex flex-col sm:flex-row sm:gap-10 gap-2 text-sm text-black">
                  <p>Subject teacher</p>
                  <p>Year of Experience</p>
                  <p>Highest Qualification</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-14 gap-2 text-sm mt-1">
                  <p>+91 xxxxxxxxxx</p>
                  <p>Email</p>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate("/facultiesdetails")}
            className="sm:w-[30%] w-full bg-white mt-4 flex items-center justify-center border border-[#93E9A2] rounded-3xl cursor-pointer text-lg sm:text-3xl py-3"
          >
            ADD ANOTHER
          </button>
        </div>
      </div>
    </div>
  );
};
export default InstituteTeacher;
