import Link from "next/link";

const Navbar = () => {
  return (
    <>
      <Link
        href="/"
        className="txt-gray-700 hover:-text-blue-600 transition-colors capitalize"
      >
        Home
      </Link>

      <Link
        href="/about"
        className="txt-gray-700 hover:-text-blue-600 transition-colors capitalize"
      >
        about
      </Link>

      <Link
        href="/products"
        className="txt-gray-700 hover:-text-blue-600 transition-colors capitalize"
      >
        Products
      </Link>
    </>
  );
};

export default Navbar;
