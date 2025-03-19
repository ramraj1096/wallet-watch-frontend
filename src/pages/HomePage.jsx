import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);
    useEffect(() => {
      if (localStorage.getItem("user_walletwatch")) {
        setLoggedIn(true);
      }
    }, []);
  return (
    <div className=" flex flex-col items-center justify-center text-center px-6  ">
      {/* Hero Section */}
      <div className="max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-500">
          Take Control of Your Finances
        </h1>
        <p className="mt-4 text-lg text-blue-600 ">
          Track your <span className="font-semibold">Income</span>, 
          <span className="font-semibold"> Expenses</span>, and 
          <span className="font-semibold"> Savings</span> in one place.
          Get real-time insights and analytics to manage your money better.
        </p>

        {/* Features Section */}
        <div className="mt-6 flex flex-wrap justify-center gap-6">
          <div className="p-4 bg-white dark:bg-gray-100 rounded-lg shadow-md w-56">
            <h3 className="text-xl font-semibold text-blue-600 ">Income Tracking</h3>
            <p className="text-gray-600 text-sm mt-2">Log and categorize your income sources.</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-100 rounded-lg shadow-md w-56">
            <h3 className="text-xl font-semibold text-red-600 ">Expense Monitoring</h3>
            <p className="text-gray-600  text-sm mt-2">Stay on top of your spending habits.</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-100 rounded-lg shadow-md w-56">
            <h3 className="text-xl font-semibold text-green-600 ">Smart Analytics</h3>
            <p className="text-gray-600 text-sm mt-2">Visualize your finances with insights.</p>
          </div>
        </div>

        {/* CTA Button */}
        { loggedIn && (
          <>
            <button 
              onClick={()=> navigate("/dashboard")}
              className="mt-8 px-6 py-3 bg-blue-600 text-white text-lg rounded-lg shadow-md hover:bg-blue-700 transition">
              Goto DashBoard
            </button>
          </>
        )
         
        }
        {
          !loggedIn && (
            <>
              <button
                onClick={()=> navigate("/login")}
                className="mt-8 px-6 py-3 bg-blue-600 text-white text-lg rounded-lg shadow-md hover:bg-blue-700 transition">
                Get Started
              </button>
            </>
          )
        }

        {/* OTP-Based Authentication Info */}
        <p className="mt-4 text-gray-500 text-sm">
          Secure your account with OTP-based authentication.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
