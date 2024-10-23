import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';



const HomePageHeader = () => {

  const [user, setUser] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setRedirect(true);
  };

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    
    if (loggedInUser) {
      setUser(true);
    } else {
      setUser(false);
      
    }
  }, []); // Empty dependency array ensures it runs once on component mount.

  if (redirect) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="bg-blue-600 py-6 px-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link className="text-3xl font-bold tracking-tight text-white" to={"/"}>
          Wallet Watch
        </Link>
        
        <LogoutIcon
          fontSize="large"
          className="text-white mr-5 cursor-pointer"
          onClick={handleLogout}
        />
        
      </div>
    </div>
  );
};

export default HomePageHeader;
