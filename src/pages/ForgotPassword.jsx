import React, { useEffect, useState } from "react";
import axios from "axios";
import { resetPasswordApi, sendOtpApi, verifyOtpApi } from "../utils/Api";
import { Link, Navigate } from "react-router-dom";
import { Alert, Box, Button, Snackbar, TextField, Typography, Container, Grid } from "@mui/material";
import validator from "validator";

const ForgotPassword = () => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
    rePassword: "",
    otp: "",
  });

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [isOtpSentToUser, setIsOtpSentToUser] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [displayIncorrectOTP, setDisplayIncorrectOTP] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [validPassword, setValidPassword] = useState(true);
  const [redirect, setRedirect] = useState(false);

  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleChange = (e) => {
    setError(false);
    setErrorMessage("");
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError(false);
    setErrorMessage("");

    setDisplayIncorrectOTP(false);
    setUserInfo({ ...userInfo, otp: "" });

    try {
      const response = await axios.post(sendOtpApi, {
        email: userInfo.email,
        isLogin: true,
        useCase: "resetPassword",
      });

      if (response.data.success) {
        setAlert(true);
        setAlertMessage("OTP sent!");
        setIsOtpSentToUser(true);
      } else {
        setError(true);
        setErrorMessage(response.data.message);
      }
    } catch (err) {
      setError(true);
      setErrorMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleVerifyEmailButton = async (e) => {
    e.preventDefault();
    setError(false);
    setErrorMessage("");

    try {
      const response = await axios.post(verifyOtpApi, {
        email: userInfo.email,
        otp: userInfo.otp,
        isBanAllowed: false,
      });

      if (response.data.success) {
        setIsEmailVerified(true);
        setAlert(true);
        setAlertMessage("Email verified!");
      } else {
        setDisplayIncorrectOTP(true);
        setErrorMessage("Incorrect OTP!");
      }
    } catch (err) {
      setError(true);
      setErrorMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleResetPasswordButton = async (e) => {
    e.preventDefault();
    setError(false);
    setErrorMessage("");

    try {
      const response = await axios.post(resetPasswordApi, {
        email: userInfo.email,
        password: userInfo.password,
      });

      if (response.data.success) {
        setRedirect(true);
      } else {
        setError(true);
        setErrorMessage(response.data.message);
      }
    } catch (err) {
      setError(true);
      setErrorMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    setValidEmail(userInfo.email.length === 0 || validator.isEmail(userInfo.email));
  }, [userInfo.email]);

  useEffect(() => {
    if (isEmailVerified && userInfo.password && userInfo.rePassword) {
      setPasswordsMatch(userInfo.password === userInfo.rePassword);
    }
  }, [isEmailVerified, userInfo.password, userInfo.rePassword]);

  useEffect(() => {
    setValidPassword(!isEmailVerified || userInfo.password?.length >= 6);
  }, [isEmailVerified, userInfo.password]);

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        mt={5}
        p={4}
        boxShadow={3}
        borderRadius={2}
      >
         <h1 className="text-3xl font-semibold text-center mb-6 text-blue-600">
                    Reset Password
                </h1>
        <Box component="form" width="100%" onSubmit={handleSendOTP}>
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
                error={!validEmail}
                helperText={!validEmail ? "Enter a valid email" : ""}
                disabled={isOtpSentToUser || isEmailVerified}
              />
            </Grid>
            {!isEmailVerified && (
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleSendOTP}
                  disabled={!validEmail || isOtpSentToUser}
                >
                  Send OTP
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
                />
              </Grid>
            )}
            {isOtpSentToUser && !isEmailVerified && (
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleVerifyEmailButton}
                  disabled={!userInfo.otp}
                >
                  Verify Email
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
                    error={!validPassword}
                    helperText={!validPassword ? "Password must be at least 6 characters" : ""}
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
                    error={!passwordsMatch}
                    helperText={!passwordsMatch ? "Passwords do not match" : ""}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleResetPasswordButton}
                disabled={!isEmailVerified || !passwordsMatch || !validPassword}
              >
                Reset Password
              </Button>
            </Grid>
            <Grid item xs={12} textAlign="center">
              <Typography variant="body2">
                <Link to="/login">Back to Login</Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
