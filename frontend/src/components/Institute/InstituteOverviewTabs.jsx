const InstituteOverviewTabs = ({ selectedTab, setSelectedTab }) => {
  const tabs = [
    "Overview",
    "Services",
    "Photos",
    "Reviews",
    "Faculty",
    "Batches",
  ];

  return (
    <div className="flex sm:flex-row flex-col mt-2">
      {tabs.map((tab, index) => (
        <button
          key={tab}
          onClick={() => setSelectedTab(tab)}
          className={`py-2 text-xl font-medium border-gray-600 
            ${
              index !== 0 ? "sm:border-l px-12" : "sm:pr-12 px-12"
            } border-b sm:border-b-0 
            ${selectedTab === tab ? "text-[#2D7B67]" : "text-black"}`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default InstituteOverviewTabs;
