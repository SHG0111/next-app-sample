import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-200">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900 mt-4 mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, the page you are looking for doesn &apos;t exist or has been
          moved to another URL.
        </p>
        <Link
          href="/"
          className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors inline-block"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
