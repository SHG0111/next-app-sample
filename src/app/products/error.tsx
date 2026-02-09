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
        <button onClick={() => reset()} className="box-bg mx-2 ">
          Try again
        </button>
        <button onClick={() => router.back()} className="box-bg mx-2 ">
          go back
        </button>
      </div>
    </div>
  );
}
