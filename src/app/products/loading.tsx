const Loading = () => {
  return (
    <div className="flex justify-center w-full">
      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 mb-2 gap-4 justify-center w-full">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col space-y-3 p-4 border rounded-lg animate-pulse"
          >
            <div className="h-48 bg-gray-200 rounded-md w-full" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
            <div className="h-6 bg-gray-200 rounded-full w-16" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;
