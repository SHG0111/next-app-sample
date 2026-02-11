import { Suspense } from "react";
import SearchResult from "./SearchResult";
const Loadig = () => {
  return (
    <main className="flex-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div className="p-6 space-y-3">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

const searchResult = () => {
  return (
    <>
      <Suspense fallback={<Loadig />}>
        <SearchResult />
      </Suspense>
    </>
  );
};

export default searchResult;
