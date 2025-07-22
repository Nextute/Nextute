import SidePanel from "./SidePanel.jsx";
const InstituteMedia = () => {
  return (
    <div className="w-full min-h-screen flex flex-row">
      <SidePanel />
      <div className="sm:p-8 p-2 w-full sm:w-[80vw]">
        <h1 className="text-3xl">Photos & Videos</h1>
      </div>
    </div>
  );
};
export default InstituteMedia;
