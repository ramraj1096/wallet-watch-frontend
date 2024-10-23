import { Alert, Box, Button, Snackbar, TextField } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { 
    registerApi, 
    sendOtpApi, 
    verifyOtpApi 
} from '../utils/Api';
import validator from 'validator';
import { Link, Navigate } from 'react-router-dom';


const Register = () => {
    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
        password: "",
        rePassword: "",
        otp: "",
    });
    const[error, setError] = useState(false);
    const[errorMessage, setErrorMessage] = useState("");
    const[validEmail, setValidEmail] = useState(false);
    const[isOtpSentToUser, setIsOtpSentToUser] = useState(false);
    const[isEmailVerified, setIsEmailVerified] = useState(false);
    const[displayIncorrectOTP, setDisplayIncorrectOTP] = useState(false);
    const[passwordsMatch, setPasswordsMatch] = useState(true);
    const[validPassword, setValidPassword] = useState(true);
    const[showPassword, setShowPassword] = useState(false);
    const[showRePassword, setShowRePassword] = useState(false);
    const[redirect, setRedirect] = useState(false);

    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
  


    const handleChange = (e) => {
        setError(false);
        setErrorMessage(false);
        setUserInfo({...userInfo, [e.target.name]: e.target.value});
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const handleClickShowRePassword = () => {
        setShowRePassword(!showRePassword);
    }

    const handleSendOTP = async (e) => {
        // handleAlertClick
        e.preventDefault();
        setError(false);
        setErrorMessage("");

        setDisplayIncorrectOTP(false);
        setUserInfo({...userInfo, otp: ""});


        try {
            const response = await axios.post(sendOtpApi, {
                "email": userInfo.email,
                "isLogin": false,
                "useCase": "register",
                "name": userInfo.name
            });

            console.log(response, response.status);

            if (response.data.success) {
                setAlert(true);
                setAlertMessage("OTP sent!")
                setIsOtpSentToUser(true);
                setError(false);
                setErrorMessage("");
            }
            else {
                
                setError(true);
                setErrorMessage(response.data.message)
            }
        } catch (err) {
            setError(true);
            console.log(err.response.data.message)
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
            setAlert(true);
            setAlertMessage("Emial verified !")
            setIsEmailVerified(true);
            
        }
        else {
            setDisplayIncorrectOTP(true);
            setUserInfo({...userInfo, [userInfo.otp]: ""})
        }

        setError(false);
        setErrorMessage("");
    } catch (err) {
        setError(true);
        setErrorMessage(error.response.data.message);
    }
}

const handleRegisterButton = async (e) => {
    e.preventDefault();
    setError(false);
    setErrorMessage("");

    const response = await axios.post(registerApi, {
        "name": userInfo.name,
        "email": userInfo.email,
        "password": userInfo.password
    });

    console.log(response.data);

    if(response.data.success) {
        
        
        setRedirect(true);
    }

    else {
        
        setError(true);
        setErrorMessage(response.data.message);
    }
};


useEffect(()=> {
    if (userInfo.email.length == 0 || validator.isEmail(userInfo.email)) {
        setValidEmail(true);
    }
    else {
        setValidEmail(false);
    }
}, [userInfo.email])

useEffect(() => {
    const user = localStorage.getItem("user");
    console.log(user);
    if (user) {
        setRedirect(true);
    }
}, []);

useEffect(()=> {
    if (isEmailVerified && userInfo.password && userInfo.rePassword) {
        if (userInfo.password !== userInfo.rePassword) {
            setPasswordsMatch(false);
        }
        else {
            setPasswordsMatch(true);
        }
    }
}, [isEmailVerified, userInfo.password, userInfo.rePassword]);

useEffect(()=> {
    if (isEmailVerified && userInfo.password) {
        if (userInfo.password.length >= 6) {
            setValidPassword(true);
        }
        else {
            setValidPassword(false);
        }
    }
}, [isEmailVerified, userInfo.password]);

if (redirect) {
    return (
        
        <Navigate to = "/" />
      
    ); 
}

  return (
    <div className=''>
        <h1 className='text-3xl font-bold text-center'>
            Register for Wallet Watch
        </h1>
        {
            error && 
                    <Snackbar 
                    open={error} 
                    anchorOrigin={{ vertical:"top", horizontal:"right" }} 
                    autoHideDuration={6000} 
                    onClose={() => setError(false)}
                    >
                    <Alert
                      severity="error"
                      variant="filled"
                      sx={{ width: '100%' }}
                    >
                      {errorMessage}
                    </Alert>
                </Snackbar>
        }

        {
            alert && 
                <Snackbar 
                    open={alert} 
                    anchorOrigin={{ vertical:"top", horizontal:"right" }} 
                    autoHideDuration={6000} 
                    onClose={() => setAlert(false)}
                >
                  <Alert
                    severity="success"
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
                p={"30px 35px"}
        >
            <div className='space-y-3'>
                <TextField
                    required
                    fullWidth
                    type="text"
                    name="name"
                    label="Name"
                    value={userInfo.name}
                    onChange={handleChange}
                />

                <div className='flex space-x-2'>
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

                    {!isEmailVerified &&
                       
                        <Button
                            fullWidth
                            style={{ textTransform: "none", padding: "14px 0px" }}
                            
                            onClick={handleSendOTP}
                            disabled={
                                !validEmail ||
                                userInfo.email.length === 0 ||
                                isOtpSentToUser ||
                                isEmailVerified
                            }
                            variant="contained"
                        >
                            SEND OTP
                        </Button>

                        }
                </div>

                {isOtpSentToUser && !isEmailVerified && (
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
                                    userInfo.otp.length === 0 ||
                                    isEmailVerified
                                }
                                fullWidth
                                variant="contained"
                            >
                                Verify Email
                            </Button>
                            
                        </>
                    )}

                    {displayIncorrectOTP && (
                        <>
                            
                            {/* <Alert severity="error">
                                Incorrect OTP
                            </Alert> */}

                            

                            <Button
                                fullWidth
                                onClick={handleSendOTP}
                                disabled={
                                    !validEmail || userInfo.length === 0
                                }
                                variant="contained"
                                style={{ textTransform: "none", padding: "14px 0px" }}
                            >
                                ReSend OTP
                            </Button>

                            
                            <Snackbar 
                                open={error} 
                                anchorOrigin={{ vertical:"top", horizontal:"right" }} 
                                autoHideDuration={6000} 
                                onClose={() => {setError(false)}}>
                                <Alert
                                //   onClose={handleClose}
                                  severity="error"
                                  variant="filled"
                                  sx={{ width: '100%' }}
                                >
                                  {errorMessage}
                                </Alert>
                            </Snackbar>
                            
                        </>
                    )}

                    {isEmailVerified && (
                        <>
                            <TextField
                            required
                            fullWidth
                            name="password"
                            type={showPassword ? "text" : "password"}
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
                                type={showRePassword ? "text" : "password"}
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
                    )}
                        <Snackbar 
                            open={!passwordsMatch} 
                            anchorOrigin={{ vertical:"top", horizontal:"right" }} 
                            autoHideDuration={6000} 
                            onClose={()=> {passwordsMatch(false)}}>
                              <Alert
                                // onClose={handleAlertClose}
                                severity="error"
                                variant="filled"
                                sx={{ width: '100%' }}
                              >
                                Password do not match
                              </Alert>
                        </Snackbar>
                        <Button
                            variant="contained"
                            onClick={handleRegisterButton}
                            disabled={
                                !isEmailVerified ||
                                !passwordsMatch ||
                                userInfo.password.length < 6 ||
                                userInfo.name.length === 0
                            }
                            fullWidth
                            style={{ textTransform: "none", padding: "14px 0px" }}
                        >
                            Register
                        </Button>
        
            </div>

            <div>
                <Link 
                    to="/login"
                    className='cursor-pointer hover:underline text-blue-600'
                    >
                        Already have an account?
                </Link>
            </div>
                  
        </Box>
    </div>
  )
}

export default Register