import Link from "next/link";

const Navbar = () => {
  return (
    <>
      <Link
        href="/"
        className="txt-gray-700 hover:-text--600 transition-colors uppercase"
      >
        Home
      </Link>

      <Link
        href="/about"
        className="txt-gray-700 hover:-text--600 transition-colors uppercase"
      >
        about
      </Link>

      <Link
        href="/products"
        className="txt-gray-700 hover:-text-blue-600 transition-colors uppercase box-bg"
      >
        Products
      </Link>
    </>
  );
};

export default Navbar;
