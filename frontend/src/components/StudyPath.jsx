const studyPaths = [
  { id: 1, name: "Engineering" },
  { id: 2, name: "Medical" },
  { id: 3, name: "Management" },
  { id: 4, name: "Law" },
  { id: 5, name: "Civil Services" },
  { id: 6, name: "Commerce" },
];

const StudyPath = () => {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#002639] mb-8 text-start">
        Explore Study Path
      </h2>

      <div className="flex items-center gap-5 sm:gap-6 justify-start overflow-x-auto scrollbar-hide">
        {studyPaths.map((path) => (
          <div
            key={path.id}
            className="bg-[#E6EDE2] rounded-full px-5 sm:px-6 md:px-8 py-2 sm:py-3 
             hover:bg-[#d7e0d5] transition text-center min-w-[140px] max-w-[200px] 
             whitespace-nowrap text-ellipsis overflow-hidden"
          >
            <p className="text-base sm:text-lg font-medium text-[#000] truncate">
              {path.name}
            </p>
          </div> 
        ))}
      </div>
    </section>
  );
};

export default StudyPath;
