const SkeletonLoader = () => (
  <div className="p-4 space-y-3">
    {[...Array(5)].map((_, index) => (
      <div
        key={index}
        className="h-6 w-full bg-gray-300 rounded animate-pulse"
      ></div>
    ))}
  </div>
);

export default SkeletonLoader;