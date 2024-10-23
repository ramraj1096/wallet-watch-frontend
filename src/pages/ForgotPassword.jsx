import React, { useEffect, useState } from 'react'
import axios from "axios"
import { resetPasswordApi, sendOtpApi, verifyOtpApi } from '../utils/Api';
import { Link, Navigate } from 'react-router-dom';
import { Alert, Box, Button, Snackbar, TextField } from '@mui/material';
import validator from 'validator';

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

    const handleSendOTP  =async (e) => {
      e.preventDefault();
      setError(false);
      setErrorMessage("");

      setDisplayIncorrectOTP(false);
      setUserInfo({...userInfo, otp: ""});

      try {
        const response = await axios.post(sendOtpApi, {
            "email": userInfo.email,
            "isLogin": true,
            "useCase": "resetPassword"
        })

        console.log(response.data, response.status);

        if (response.data.success) {
            setAlert(true);
            setAlertMessage("OTP sent !")
            setIsOtpSentToUser(true);
            setError(false);
            setErrorMessage("");
        }
        else {
          setAlert(false);
          setAlertMessage("");
            setError(true);
            setErrorMessage(response.data.message);
        }

      } catch (err) {
            setError(true);
            setErrorMessage(err.response.data.message);
      }
    }

    const handleVerifyEmailButton = async (e) => {
        e.preventDefault();
        setError(false);
        setErrorMessage("");

        try {
          const response = await axios.post(verifyOtpApi, {
                "email": userInfo.email,
                "otp": userInfo.otp,
                "isBanAllowed": false
          });

          console.log(response.data, response.status);

          if (response.data.success) {
            
            setDisplayIncorrectOTP(false);
            setIsEmailVerified(true);
            setAlert(true);
            setAlertMessage("Email verified !")

          }
          else {
            setAlert(false);
            setAlertMessage("Incorrect OTP !");
            setDisplayIncorrectOTP(true);
            setUserInfo({...userInfo, [userInfo.otp]: ""});
          }

          setError(false);
          setErrorMessage("");

        } catch (err) {
          setError(true);
          setErrorMessage(err.response.data.message);
        }
    }

    const handleResetPasswordButton = async (e) => {
        e.preventDefault();
        setError(false);
        setErrorMessage("");

        const response = await axios.post(resetPasswordApi, {
            "email": userInfo.email,
            "password": userInfo.password
        })

        console.log(response.data);

        if (response.data.success) {
          setRedirect(true);
        }

        else {
          setError(true);
          setErrorMessage(response.data.message);
        }

        
    }

    useEffect(() => {
      if (userInfo.email?.length === 0 || validator.isEmail(userInfo.email)) {
          setValidEmail(true);
      } else {
          setValidEmail(false);
      }
  }, [userInfo.email]);

    useEffect(() => {
      // localStorage.clear();

      const user = localStorage.getItem("user");
      console.log(user);

      if (user) {

        setRedirect(true);
      }
    },[]);

    useEffect(()=> {
      if (isEmailVerified && userInfo.password && userInfo.rePassword) {
        if (userInfo.password !== userInfo.rePassword) {
          setPasswordsMatch(false);
        }
        else {
          setPasswordsMatch(true);
        }
      }
    },[isEmailVerified, userInfo.password, userInfo.rePassword]);


    useEffect(()=> {
      if (isEmailVerified && userInfo.password) {

        if (userInfo.password?.length>=6) {
          setValidPassword(true);
        }
        else {
          setValidPassword(false);
        }
      }
      else {
        setValidPassword(true);
      }
    }, [isEmailVerified, userInfo.password]);

    if (redirect) {
      return <Navigate to = "/" />
    }

  return (
    <div>
      <h1 className='text-3xl font-bold text-center'>
            Reset Password
      </h1>
      {
        error &&
          <Snackbar 
            open={error} 
            anchorOrigin={{ vertical:"top", horizontal:"right" }} 
            autoHideDuration={6000} 
            onClose={()=> {setError(false)}}>
              <Alert
                // onClose={handleAlertClose}
                severity="error"
                variant="filled"
                sx={{ width: '100%' }}
              >
                {errorMessage}
              </Alert>
          </Snackbar>
      }

      {
        !error &&
          <Snackbar 
            open={alert} 
            anchorOrigin={{ vertical:"top", horizontal:"right" }} 
            autoHideDuration={6000} 
            onClose={()=> {setAlert(false)}}>
              <Alert
                // onClose={handleAlertClose}
                severity="success"
                variant="filled"
                sx={{ width: '100%' }}
              >
                {alertMessage}
              </Alert>
          </Snackbar>
      }

      {
        displayIncorrectOTP &&
        <Snackbar 
          open={displayIncorrectOTP} 
          anchorOrigin={{ vertical:"top", horizontal:"right" }} 
          autoHideDuration={6000} 
          onClose={()=> {setDisplayIncorrectOTP(false)}}>
            <Alert
              // onClose={handleAlertClose}
              severity="error"
              variant="filled"
              sx={{ width: '100%' }}
            >
              {alertMessage}
            </Alert>
        </Snackbar>
      }

        <Box
            border={"3px solid grey"}
            borderRadius={"15px"}
            width={"40%"}
            margin={"5% auto"}
            p={"35px 40px"}
        >
          <div className='space-y-5'>
            <div className='flex space-x-4'>
            <TextField
                required
                fullWidth
                type="email"
                name="email"
                error={!validEmail}
                helperText={
                    !validEmail ? "Please Enter a valid Email" : ""
                }
                label="Email"
                value={userInfo.email}
                onChange={handleChange}
                disabled={isOtpSentToUser || isEmailVerified}
                />

          {
            !isEmailVerified &&
              <Button
                  fullWidth
                  style={{ textTransform: "none", padding: "14px 0px" }}
                  onClick={handleSendOTP}
                  disabled={
                      !validEmail ||
                      userInfo.email?.length === 0 ||
                      isOtpSentToUser ||
                      isEmailVerified
                  }
                  variant="contained"
              >
                  SEND OTP
              </Button>
            
          }
            </div>

          {
            isOtpSentToUser && !isEmailVerified && (
              <>
              <TextField
                required
                name="otp"
                label="Enter OTP"
                value={userInfo.otp}
                disabled={
                    !isOtpSentToUser ||
                    displayIncorrectOTP ||
                    isEmailVerified
                }
                fullWidth
                onChange={handleChange}
              />

              <Button
                  style={{ textTransform: "none", padding: "14px 0px" }}
                  onClick={handleVerifyEmailButton}
                  disabled={
                      displayIncorrectOTP ||
                      userInfo.otp?.length === 0 ||
                      isEmailVerified
                  }
                  fullWidth
                  variant="contained"
              >
                  Verify Email
              </Button>

              </>

            )
          }

          {
            displayIncorrectOTP && (
              <>
                
                <Button
                  fullWidth
                  onClick={handleSendOTP}
                  disabled={
                      !validEmail || userInfo?.length === 0
                  }
                  variant="contained"
                  style={{ textTransform: "none", padding: "14px 0px" }}
                >
                  ReSend OTP
              </Button>
              </>
            )
          }

          {
            isEmailVerified && (
              <>
                <TextField
                    required
                    fullWidth
                    name="password"
                    type={ "password"}
                    error={!validPassword}
                    label="Enter Password"
                    value={userInfo.password}
                    onChange={handleChange}
                    helperText={
                        !validPassword
                            ? "Password must be atleast 6 character"
                            : ""
                    }

                  />

                  <TextField
                      required
                      fullWidth
                      name="rePassword"
                      type={ "password"}
                      label="Re-enter Password"
                      error={!passwordsMatch}
                      value={userInfo.rePassword}
                      onChange={handleChange}
                      helperText={
                          !passwordsMatch
                              ? "Passwords don't match"
                              : ""
                      }
                      
                  />
              </>
            )
          }

            <Button
              variant="contained"
              onClick={handleResetPasswordButton}
              disabled={
                  !isEmailVerified ||
                  !passwordsMatch ||
                  userInfo.password?.length < 6
              }
              fullWidth
              style={{ textTransform: "none", padding: "14px 0px" }}
             >
                 Reset Password
             </Button>
          </div>
          <div className='text-blue-600 flex justify-between py-3'>
            <Link 
              to="/login" 
              className='hover:cursor-pointer hover:underline'
              >
                  Already have an account ?
              </Link>
            <Link 
              to="/register" 
              className='hover:cursor-pointer hover:underline'
              >
                  New user?
            </Link>
            </div>
        </Box>
    </div>
  )
}

export default ForgotPassword