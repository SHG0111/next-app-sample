const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t mt-auto py-6">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-600">
          © {new Date().getFullYear()} Next App. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
