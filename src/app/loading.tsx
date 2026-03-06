export default function Loading() {
  return (
    <div className="px-4 grid grid-cols-2 md:grid-cols-4 gap-3 h-96  ">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="animate-pulse w-full h-full  ">
          <div className="bg-gray-200 h-5/6 "></div>
          <div className="mt-4 space-y-2 flex justify-center items-center">
            <div className="bg-gray-200  h-12 w-2/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
