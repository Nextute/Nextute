import SidePanel from "./SidePanel.jsx";
import { useNavigate } from "react-router-dom";
import edit from "../../../assets/pencil.svg";
import deletebin from "../../../assets/trash.svg";


const InstituteBatch = () => {

  const navigate = useNavigate();

  
  return (
    <div className="w-full min-h-screen flex flex-row">
      <SidePanel />
      <div className="sm:p-8 p-2 w-full sm:w-[80vw]">
        <h1 className="text-3xl font-medium p-5">Batch Details</h1>
        <div className="flex flex-col items-center w-full">
          <div className="relative flex flex-row bg-[#E6EDE2] border border-black rounded-2xl p-3 sm:px-12 sm:py-4 w-[96%]">
            <div className="absolute top-0 right-0 flex gap-2 p-2">
              <img
                src={edit}
                alt="edit logo"
                className="w-4 h-4 cursor-pointer"
                onClick={() => navigate("/courseoffered")}
              />
              <img
                src={deletebin}
                alt="delete logo"
                className="w-4 h-4 cursor-pointer"
              />
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold">Batch 1</h2>
                <div className="flex flex-col sm:flex-row sm:gap-10 gap-2 text-sm text-black ">
                  <div className="bg-white text-lg rounded-lg px-2 py-1 border border-black">
                    Regular Batch
                  </div>
                  <div className="bg-white text-lg rounded-lg px-2 py-1 border border-black">
                    JEE
                  </div>
                  <div className="bg-white text-lg rounded-lg px-2 py-1 border border-black">
                    Hinglish Medium
                  </div>
                  <div className="bg-white text-lg rounded-lg px-2 py-1 border border-black">
                    250 students
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate("/courseoffered")}
            className="sm:w-[30%] w-full bg-white mt-4 flex items-center justify-center border border-[#93E9A2] rounded-3xl cursor-pointer text-lg sm:text-3xl py-3"
          >
            ADD ANOTHER
          </button>
        </div>
      </div>
    </div>
  );
};
export default InstituteBatch;
