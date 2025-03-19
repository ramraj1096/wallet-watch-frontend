const Footer = () => {
    return (
      <footer className="bg-blue-600 py-6 px-8 md:px-12">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <span className="text-3xl text-white font-bold tracking-tight">
            Wallet Watch
          </span>
          <div className="flex gap-6 text-white text-lg">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  