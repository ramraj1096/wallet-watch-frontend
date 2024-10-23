const Footer = () => {
    return (
      <div className="bg-blue-600 py-6 px-10">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
              <span className="text-3xl text-white font-bold tracking-tight">
                  Wallet Watch
              </span>
              <span className="text-white font-bold tracking-tight flex gap-4">
                  <span className="hover:cursor-pointer">Privacy Policy</span>
                  <span className="hover:cursor-pointer">Terms of Service</span>
              </span>
          </div>
      </div>
    )
  }
  
  export default Footer