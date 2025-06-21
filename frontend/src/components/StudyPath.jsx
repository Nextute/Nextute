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
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl md:text-4xl font-semibold text-[#002639] mb-8 text-start">
        Explore Study Path
      </h2>

      <div className="flex items-center justify-center gap-6 flex-wrap">
        {studyPaths.map((path) => (
          <span key={path.id} className="bg-[#E6EDE2] rounded-full px-7 py-3">
            <p className="text-2xl font-medium text-[#000]">{path.name}</p>
          </span>
        ))}
      </div>
    </div>
  );
};

export default StudyPath;
