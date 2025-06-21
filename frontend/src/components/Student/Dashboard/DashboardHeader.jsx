import { assets } from "../../../assets/assets";

const DashboardHeader = ({ studentData }) => {
  return (
    <div>
      <div className="w-full h-24 px-5 sm:px-12 py-2 bg-[#FDFBFB] flex items-center justify-between">
        {/*-------LOGO---------*/}
        <img
          src={assets.logo}
          alt="Nextute logo"
          className="w-28 sm:w-32 lg:w-40"
        />

        {/*-------MESSAGE AND NOTIFICATION --------*/}
        <div className="flex items-center justify-center gap-5 flex-shrink-0">
          <span className="bg-[#F4F4F4] p-3 rounded-full">
            <img
              src={assets.message}
              alt="message"
              className="w-6 sm:w-7 lg:w-8"
            />
          </span>

          <span className="bg-[#F4F4F4] p-3 rounded-full">
            <img
              src={assets.notification}
              alt="message"
              className="w-5 sm:w-6 lg:w-6"
            />
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
