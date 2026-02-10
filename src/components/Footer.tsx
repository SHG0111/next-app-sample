const Footer = () => {
  return (
    <footer className="fixed bottom-1 w-full">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-500 font-thin">
          © {new Date().getFullYear()} Next App. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
