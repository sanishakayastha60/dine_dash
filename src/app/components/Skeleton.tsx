export default function Skeleton() {
  return (
    <div className="flex flex-wrap gap-5 animate-pulse">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="w-64 border rounded-xl overflow-hidden bg-white"
        >
          <div className="h-44 bg-gray-200" />

          <div className="p-3 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-3/4" />

            <div className="h-4 bg-gray-200 rounded w-1/2" />

            <div className="h-10 bg-gray-200 rounded" />

            <div className="h-4 bg-gray-200 rounded w-full" />

            <div className="h-8 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
