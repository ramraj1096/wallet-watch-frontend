import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
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
    <header className="bg-blue-600 py-4 px-6 md:px-12">
      <div className="container mx-auto flex justify-between items-center">
        <Link className="text-3xl font-bold text-white hover:text-gray-200 transition duration-300" to="/">
          Wallet Watch
        </Link>
        
        <div className="flex items-center space-x-4">
          {/* {user ? (
            <>
              <button 
                onClick={handleLogout}
                className="flex items-center text-white hover:text-gray-200 transition duration-300"
              >
                <LogoutIcon fontSize="large" />
                <span className="ml-2 text-lg">Logout</span>
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              className="text-white hover:text-gray-200 transition duration-300"
            >
              Login
            </Link>
          )} */}
        </div>
      </div>
    </header>
  );
};

export default Header;
