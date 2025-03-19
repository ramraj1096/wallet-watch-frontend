import React, { useEffect, useState } from 'react';
import { TextField, Button, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import validator from 'validator';
import { registerApi, sendOtpApi, verifyOtpApi } from '../utils/Api';

const Register = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    password: '',
    rePassword: '',
    otp: '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({
    isOtpSent: false,
    isEmailVerified: false,
    redirect: false,
    showAlert: false,
    alertMessage: '',
    alertType: 'success',
    loadingOtp: false,
    loadingVerify: false,
    loadingRegister: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSendOtp = async () => {
    setStatus((prev) => ({ ...prev, loadingOtp: true }));
    try {
      const response = await axios.post(sendOtpApi, {
        email: userInfo.email,
        isLogin: false,
        useCase: 'register',
        name: userInfo.name,
      });
      if (response.data.success) {
        setStatus((prev) => ({
          ...prev,
          isOtpSent: true,
          showAlert: true,
          alertMessage: 'OTP sent successfully!',
          alertType: 'success',
        }));
      }
    } catch (error) {
      setErrors({ email: 'Failed to send OTP. Please try again.' });
    }
    setStatus((prev) => ({ ...prev, loadingOtp: false }));
  };

  const handleVerifyOtp = async () => {
    setStatus((prev) => ({ ...prev, loadingVerify: true }));
    try {
      const response = await axios.post(verifyOtpApi, {
        email: userInfo.email,
        otp: userInfo.otp,
        isBanAllowed: false,
      });
      if (response.data.success) {
        setStatus((prev) => ({
          ...prev,
          isEmailVerified: true,
          showAlert: true,
          alertMessage: 'Email verified successfully!',
          alertType: 'success',
        }));
      }
    } catch (error) {
      setErrors({ otp: 'Invalid OTP. Please try again.' });
    }
    setStatus((prev) => ({ ...prev, loadingVerify: false }));
  };

  const handleRegister = async () => {
    setStatus((prev) => ({ ...prev, loadingRegister: true }));
    try {
      const response = await axios.post(registerApi, {
        name: userInfo.name,
        email: userInfo.email,
        password: userInfo.password,
      });
      if (response.data.success) {
        setStatus((prev) => ({ ...prev, redirect: true }));
      }
    } catch (error) {
      setErrors({ general: 'Registration failed. Please try again.' });
    }
    setStatus((prev) => ({ ...prev, loadingRegister: false }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!userInfo.name) newErrors.name = 'Name is required.';
    if (!validator.isEmail(userInfo.email)) newErrors.email = 'Invalid email.';
    if (userInfo.password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    if (userInfo.password !== userInfo.rePassword) newErrors.rePassword = 'Passwords do not match.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const user = localStorage.getItem('user_walletwatch');
    if (user) {
      setStatus((prev) => ({ ...prev, redirect: true }));
    }
  }, []);

  if (status.redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex justify-center items-center px-4">
      <div className="w-full max-w-lg bg-gray-100 p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold text-center mb-6 text-blue-600">
          Register for Wallet Watch
        </h1>
        {status.showAlert && (
          <Snackbar
            open={status.showAlert}
            autoHideDuration={4000}
            onClose={() => setStatus((prev) => ({ ...prev, showAlert: false }))}
          >
            <Alert severity={status.alertType} variant="filled" sx={{ width: '100%' }}>
              {status.alertMessage}
            </Alert>
          </Snackbar>
        )}
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={userInfo.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <div className="flex space-x-2">
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={userInfo.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={status.isOtpSent || status.isEmailVerified}
            />
            {!status.isEmailVerified && (
              <Button
                onClick={handleSendOtp}
                disabled={!validator.isEmail(userInfo.email) || status.loadingOtp}
                variant="contained"
                color="primary"
              >
                {status.loadingOtp ? 'Please wait...' : 'Send OTP'}
              </Button>
            )}
          </div>
          {status.isOtpSent && !status.isEmailVerified && (
            <>
              <TextField
                fullWidth
                label="Enter OTP"
                name="otp"
                value={userInfo.otp}
                onChange={handleChange}
                error={!!errors.otp}
                helperText={errors.otp}
              />
              <Button
                onClick={handleVerifyOtp}
                fullWidth
                variant="contained"
                color="success"
                disabled={status.loadingVerify}
              >
                {status.loadingVerify ? 'Verifying...' : 'Verify Email'}
              </Button>
            </>
          )}
          {status.isEmailVerified && (
            <>
              <TextField
                fullWidth
                label="Password"
                type="password"
                name="password"
                value={userInfo.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                name="rePassword"
                value={userInfo.rePassword}
                onChange={handleChange}
                error={!!errors.rePassword}
                helperText={errors.rePassword}
              />
              <Button
                onClick={() => validateForm() && handleRegister()}
                fullWidth
                variant="contained"
                color="primary"
                disabled={status.loadingRegister}
              >
                {status.loadingRegister ? 'Please wait...' : 'Register'}
              </Button>
            </>
          )}
          <p className="text-sm text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
