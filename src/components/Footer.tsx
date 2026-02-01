const Footer = () => {
  return (
    <footer className="bg-white mt-8 py-6">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-600">
          © {new Date().getFullYear()} Next App. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
