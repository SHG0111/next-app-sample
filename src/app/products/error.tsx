"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4 text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        Something went wrong while loading products!
      </h2>
      <p className="text-gray-600 mb-6">
        {error.message || "An unexpected error occurred."}
      </p>
      <div className="flex ">
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-blue-600 text-white mx-2 hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-blue-600 text-white mx-2 hover:bg-blue-700 transition-colors"
        >
          go back
        </button>
      </div>
    </div>
  );
}
