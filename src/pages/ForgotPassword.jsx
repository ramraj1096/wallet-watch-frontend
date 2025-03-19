import React, { useEffect, useState } from "react";
import axios from "axios";
import { resetPasswordApi, sendOtpApi, verifyOtpApi } from "../utils/Api";
import { Link, Navigate } from "react-router-dom";
import { Alert, Box, Button, CircularProgress, Snackbar, TextField, Typography, Container, Grid } from "@mui/material";
import validator from "validator";

const ForgotPassword = () => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
    rePassword: "",
    otp: "",
  });

  const [error, setError] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [isOtpSentToUser, setIsOtpSentToUser] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [validPassword, setValidPassword] = useState(true);
  const [validOtp, setValidOtp] = useState(false);
  const [redirect, setRedirect] = useState(false);

  // Loading states
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);

  const handleChange = (e) => {
    setError("");
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  // Validate Email
  useEffect(() => {
    setValidEmail(validator.isEmail(userInfo.email));
  }, [userInfo.email]);

  // Validate OTP (should be exactly 6 digits)
  useEffect(() => {
    setValidOtp(/^\d{6}$/.test(userInfo.otp));
  }, [userInfo.otp]);

  // Validate Password (at least 6 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
  useEffect(() => {
    setValidPassword(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(userInfo.password));
  }, [userInfo.password]);

  // Check if passwords match
  useEffect(() => {
    setPasswordsMatch(userInfo.password === userInfo.rePassword);
  }, [userInfo.password, userInfo.rePassword]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoadingOtp(true);

    try {
      const response = await axios.post(sendOtpApi, {
        email: userInfo.email,
        isLogin: true,
        useCase: "resetPassword",
      });

      if (response.data.success) {
        setIsOtpSentToUser(true);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoadingOtp(false);
    }
  };

  const handleVerifyEmailButton = async (e) => {
    e.preventDefault();
    setError("");
    setLoadingVerify(true);

    try {
      const response = await axios.post(verifyOtpApi, {
        email: userInfo.email,
        otp: userInfo.otp,
        isBanAllowed: false,
      });

      if (response.data.success) {
        setIsEmailVerified(true);
      } else {
        setError("Incorrect OTP!");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoadingVerify(false);
    }
  };

  const handleResetPasswordButton = async (e) => {
    e.preventDefault();
    setError("");
    setLoadingReset(true);

    try {
      const response = await axios.post(resetPasswordApi, {
        email: userInfo.email,
        password: userInfo.password,
      });

      if (response.data.success) {
        setRedirect(true);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoadingReset(false);
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" mt={5} p={4} boxShadow={3} borderRadius={2}>
        <h1 className="text-3xl font-semibold text-center mb-6 text-blue-600">
          Reset Password
        </h1>

        {error && <Alert severity="error">{error}</Alert>}

        <Box component="form" width="100%">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={userInfo.email}
                onChange={handleChange}
                error={!validEmail && userInfo.email.length > 0}
                helperText={!validEmail && userInfo.email.length > 0 ? "Enter a valid email" : ""}
                disabled={isOtpSentToUser || isEmailVerified || loadingOtp}
              />
            </Grid>

            {!isEmailVerified && (
              <Grid item xs={12}>
                <Button fullWidth variant="contained" color="primary" onClick={handleSendOTP} disabled={!validEmail || isOtpSentToUser || loadingOtp}>
                  {loadingOtp ? <CircularProgress size={24} color="inherit" /> : "Send OTP"}
                </Button>
              </Grid>
            )}

            {isOtpSentToUser && !isEmailVerified && (
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Enter OTP"
                  name="otp"
                  value={userInfo.otp}
                  onChange={handleChange}
                  error={!validOtp && userInfo.otp.length > 0}
                  helperText={!validOtp && userInfo.otp.length > 0 ? "OTP must be 6 digits" : ""}
                />
              </Grid>
            )}

            {isOtpSentToUser && !isEmailVerified && (
              <Grid item xs={12}>
                <Button fullWidth variant="contained" color="primary" onClick={handleVerifyEmailButton} disabled={!validOtp || loadingVerify}>
                  {loadingVerify ? <CircularProgress size={24} color="inherit" /> : "Verify Email"}
                </Button>
              </Grid>
            )}

            {isEmailVerified && (
              <>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="New Password"
                    name="password"
                    type="password"
                    value={userInfo.password}
                    onChange={handleChange}
                    error={!validPassword && userInfo.password.length > 0}
                    helperText={!validPassword && userInfo.password.length > 0 ? "Min 6 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char" : ""}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Confirm Password"
                    name="rePassword"
                    type="password"
                    value={userInfo.rePassword}
                    onChange={handleChange}
                    error={!passwordsMatch && userInfo.rePassword.length > 0}
                    helperText={!passwordsMatch && userInfo.rePassword.length > 0 ? "Passwords do not match" : ""}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Button fullWidth variant="contained" color="primary" onClick={handleResetPasswordButton} disabled={!isEmailVerified || !passwordsMatch || !validPassword || loadingReset}>
                {loadingReset ? <CircularProgress size={24} color="inherit" /> : "Reset Password"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
