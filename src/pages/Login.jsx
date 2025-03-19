import axios from "axios";
import React, { useEffect, useState } from "react";
import { loginApi } from "../utils/Api";
import validator from "validator";
import { Link, Navigate } from "react-router-dom";

const Login = () => {
  const [userInfo, setUserInfo] = useState({ email: "", password: "" });
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("user_walletwatch")) {
      setRedirect(true);
    }
  }, []);

  const handleInputChange = (e) => {
    setError("");
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!userInfo.email || !userInfo.password) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }

    if (!validator.isEmail(userInfo.email)) {
      setError("Invalid email format.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(loginApi, { email: userInfo.email, password: userInfo.password });
      if (response.data.success) {
        localStorage.setItem("user_walletwatch", JSON.stringify(response.data.user));
        setRedirect(true);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
    setLoading(false);
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex justify-center items-center">
      <div className="bg-white w-full sm:w-96 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center mb-6 text-blue-600">Login</h1>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm mb-4">{error}</div>}

        <div className="space-y-4">
          <input
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            name="email"
            onChange={handleInputChange}
          />

          <input
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            type="password"
            name="password"
            onChange={handleInputChange}
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
          >
            {loading ? "Please wait..." : "Login"}
          </button>

          <div className="text-blue-600 flex justify-between mt-6 text-sm">
            <Link to="/resetPassword" className="hover:underline">Forgot Password?</Link>
            <Link to="/register" className="hover:underline">New user? Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;