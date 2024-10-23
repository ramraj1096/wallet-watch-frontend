import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { loginApi,
     sendOtpApi, 
     verifyOtpApi }
      from '../utils/Api';
import validator from 'validator';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Snackbar, TextField } from '@mui/material';

const Login = () => {
    const [userInfo, setUserInfo] = useState({
        email: "",
        password: "",
        otp: "",
    })

    const[currentUser, setCurrentUser] = useState();
    const[redirect, setRedirect] = useState(false);
    const[error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [validEmail, setValidEmail] = useState(true);
    const [credentialsValidated, setCredentialsValidated] = useState(false);
    const [showIncorrectOtp, setShowIncorrectOtp] = useState(false);
    const [otpOptions, setOtpOptions] = useState([]);

    const [alert, setAlert] = useState(false);

    
    

    useEffect(() => {
        const user = localStorage.getItem('user');
        console.log(user);

        if (user) {
            setRedirect(true);
        }
    }, []);

    const handleSelectOTP = (e) => {
        
        setError(false);
        setErrorMessage("");
        setUserInfo({...userInfo, [e.target.name]: e.target.value});
    };

    const handleUserInfoChange = (e) => {
        setError(false);
        setErrorMessage("");
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    };

    const sendOtp = async () => {
        setError(false);
        setErrorMessage("");
        setAlert(true);

        try {
            const response = await axios.post(sendOtpApi, {
                "email": userInfo.email,
                "isLogin": true,
                "useCase": "login"
            });

            console.log(response.data);
            console.log("otp options,", response.data.otpInfo.options)

            if (response.data.success) {
                setOtpOptions(response.data.otpInfo.options)
                
                setError(false);
                setErrorMessage("");
            }
            

        } catch (err) {
            setError(true);
            setErrorMessage(err.response.message || "some error occured in sending otp");
            
        }
    }

    const handleLoginButton = async (e) => {
        

        e.preventDefault();
        setError(false);
        setErrorMessage("");

        try {
            const response = await axios.post(loginApi, {
                "email": userInfo.email,
                "password": userInfo.password
            });

            console.log(response);

            if (response.data.success) {
                setCredentialsValidated(true);
                console.log(response.data);
                setAlert(true);

                setCurrentUser(response.data.user);
                sendOtp();
            }
            else {
                setError(true);
                setErrorMessage(response.data.message);
                setAlert(false);
            }
        } catch (err) {
            setError(true);
            setErrorMessage(err.response.data.message);
            
        }
    }

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError(false);
        setErrorMessage("");

        try {
            const response = await axios.post(verifyOtpApi, {
                "email": userInfo.email,
                "otp": userInfo.otp,
                "isBanAllowed": true
            });

            console.log(response.data, response.status);

            if (response.data.success) {
                localStorage.setItem("user", JSON.stringify(currentUser));
                setAlert(true);
                setRedirect(true);
                
            }
            else {
                setShowIncorrectOtp(true);
                setAlert(false);
                setError(true);
                setErrorMessage(response.data.message);
                console.log("Invalid OTP");
            }

        } catch (err) {
            setError(true);
            setErrorMessage(err.response.data.message);
            
        }
    };

    useEffect(() => {
        if (userInfo.email.length === 0 ||
            validator.isEmail(userInfo.email)
        ) {
            setValidEmail(true);
        }
        else {
            setValidEmail(false);
        }
    }, [userInfo.email]);

    if (redirect) {
        return <Navigate to = "/" />
    }
  return (
    <div>
        <h1 className='text-3xl font-bold text-center'>
            Login for Wallet Watch
        </h1>

        {
                error &&
  
                // <Alert severity="error" fullWidth>
                //     {errorMessage}
                // </Alert>
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

        <Box
            border={"3px solid grey"}
            borderRadius={"15px"}
            width={"40%"}
            margin={"5% auto"}
            p={"30px 35px"}
        >
            <div className='space-y-3'>
                <TextField
                    disabled={credentialsValidated}
                    required
                    fullWidth
                    error={!validEmail}
                    helperText={
                        !validEmail ? "Enter valid email" : ""
                    }
                    label="Email"
                    value={userInfo.email}
                    name="email"
                    onChange={handleUserInfoChange}
                />

                <TextField
                    disabled={credentialsValidated}
                    required
                    fullWidth
                    label="Password"
                    value={userInfo.password}
                    name="password"
                    type={ "password" }
                    onChange={handleUserInfoChange}
                    
                />

                {
                    !credentialsValidated &&
                    
                        <Button
                            variant="contained"
                            onClick={handleLoginButton}
                            disabled={
                                !validEmail || userInfo.email.length === 0 || userInfo.password.length === 0
                            }
                            style={{ textTransform: "none", padding: "14px 0px",  }}
                            fullWidth
                        >
                            Verify Credentials
                        </Button>
                }

                {
                    credentialsValidated && 
                        <>
                            {
                                !showIncorrectOtp &&

                                    // <Alert severity="success" fullWidth>
                                    //     OTP sent to your email. Verify the OTP:{" "}
                                    // </Alert>
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
                                            OTP sent to your email. Verify the OTP
                                          </Alert>
                                    </Snackbar>
                                
                            }


                            {
                                !showIncorrectOtp &&
                                otpOptions.map((option) => {
                                    return (
                                        
                                            <div className="w-1/4 flex flex-row items-center space-x-2 ">
                                            <Button
                                                variant={userInfo.otp === option ? "contained" : "outlined"}
                                                value={option}
                                                name="otp"
                                                onClick={handleSelectOTP}  // Pass the name="otp"
                                            >
                                                {option}
                                            </Button>

                                            </div>
                                     
                                    )
                                })
                            }

                            {
                                !showIncorrectOtp &&
                                <>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        disabled={
                                            userInfo.otp === "" || showIncorrectOtp
                                        }
                                        onClick={handleVerifyOtp}
                                    >
                                        Verify
                                    </Button>
                                </>
                                    
                            }
                        
                        </>
                }

                    <div className='text-blue-600  flex justify-between space-x-3'>
                      <Link 
                        to="/resetPassword" 
                        className='hover:cursor-pointer hover:underline'
                        >
                            Forgot Password?
                        </Link>
                      <Link 
                        to="/register" 
                        className='hover:cursor-pointer hover:underline'
                        >
                            New user?
                      </Link>
                    </div>
            </div>

        </Box>

    </div>
  )
}

export default Login