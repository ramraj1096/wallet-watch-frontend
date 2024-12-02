import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { loginApi, sendOtpApi, verifyOtpApi } from '../utils/Api';
import validator from 'validator';
import { Link, Navigate } from 'react-router-dom';
import { Alert, Box, Button, Snackbar, TextField } from '@mui/material';

const Login = () => {
    const [userInfo, setUserInfo] = useState({ email: "", password: "", otp: "" });
    const [currentUser, setCurrentUser] = useState();
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [validEmail, setValidEmail] = useState(true);
    const [credentialsValidated, setCredentialsValidated] = useState(false);
    const [showIncorrectOtp, setShowIncorrectOtp] = useState(false);
    const [otpOptions, setOtpOptions] = useState([]);
    const [alert, setAlert] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setRedirect(true);
        }
    }, []);

    const handleSelectOTP = (e) => {
        setError(false);
        setErrorMessage("");
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
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

            if (response.data.success) {
                setOtpOptions(response.data.otpInfo.options);
                setError(false);
                setErrorMessage("");
            }
        } catch (err) {
            setError(true);
            setErrorMessage(err.response.message || "Some error occurred while sending OTP");
        }
    };

    const handleLoginButton = async (e) => {
        e.preventDefault();
        setError(false);
        setErrorMessage("");
        try {
            const response = await axios.post(loginApi, {
                "email": userInfo.email,
                "password": userInfo.password
            });

            if (response.data.success) {
                setCredentialsValidated(true);
                setAlert(true);
                setCurrentUser(response.data.user);
                sendOtp();
            } else {
                setError(true);
                setErrorMessage(response.data.message);
                setAlert(false);
            }
        } catch (err) {
            setError(true);
            setErrorMessage(err.response.data.message);
        }
    };

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

            if (response.data.success) {
                localStorage.setItem("user", JSON.stringify(currentUser));
                setAlert(true);
                setRedirect(true);
            } else {
                setShowIncorrectOtp(true);
                setAlert(false);
                setError(true);
                setErrorMessage(response.data.message);
            }
        } catch (err) {
            setError(true);
            setErrorMessage(err.response.data.message);
        }
    };

    useEffect(() => {
        if (userInfo.email.length === 0 || validator.isEmail(userInfo.email)) {
            setValidEmail(true);
        } else {
            setValidEmail(false);
        }
    }, [userInfo.email]);

    if (redirect) {
        return <Navigate to="/" />;
    }

    return (
        <div className=" flex justify-center items-center ">
            <div className="bg-gray-100 w-full sm:w-96 p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-semibold text-center mb-6 text-blue-600">
                    Login for Wallet Watch
                </h1>

                {error && (
                    <Snackbar
                        open={error}
                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                        autoHideDuration={6000}
                        onClose={() => { setError(false); }}
                    >
                        <Alert severity="error" variant="filled" sx={{ width: '100%' }}>
                            {errorMessage}
                        </Alert>
                    </Snackbar>
                )}

                <Box className="space-y-4">
                    <TextField
                        disabled={credentialsValidated}
                        required
                        fullWidth
                        error={!validEmail}
                        helperText={!validEmail ? "Enter a valid email" : ""}
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
                        type="password"
                        value={userInfo.password}
                        name="password"
                        onChange={handleUserInfoChange}
                    />

                    {!credentialsValidated && (
                        <Button
                            variant="contained"
                            onClick={handleLoginButton}
                            disabled={!validEmail || userInfo.email.length === 0 || userInfo.password.length === 0}
                            fullWidth
                            className="py-3 text-lg"
                        >
                            Verify Credentials
                        </Button>
                    )}

                    {credentialsValidated && (
                        <>
                            {!showIncorrectOtp && (
                                <Snackbar
                                    open={alert}
                                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                                    autoHideDuration={6000}
                                    onClose={() => { setAlert(false); }}
                                >
                                    <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
                                        OTP sent to your email. Verify the OTP
                                    </Alert>
                                </Snackbar>
                            )}

                            {!showIncorrectOtp && otpOptions.map((option) => (
                                <div key={option} className="flex items-center space-x-2">
                                    <Button
                                        variant={userInfo.otp === option ? "contained" : "outlined"}
                                        value={option}
                                        name="otp"
                                        onClick={handleSelectOTP}
                                    >
                                        {option}
                                    </Button>
                                </div>
                            ))}

                            {!showIncorrectOtp && (
                                <Button
                                    variant="contained"
                                    fullWidth
                                    disabled={userInfo.otp === "" || showIncorrectOtp}
                                    onClick={handleVerifyOtp}
                                    className="mt-4 py-3 text-lg"
                                >
                                    Verify OTP
                                </Button>
                            )}
                        </>
                    )}

                    <div className="text-blue-600 flex justify-between mt-6">
                        <Link to="/resetPassword" className="hover:underline">
                            Forgot Password?
                        </Link>
                        <Link to="/register" className="hover:underline">
                            New user?
                        </Link>
                    </div>
                </Box>
            </div>
        </div>
    );
};

export default Login;
